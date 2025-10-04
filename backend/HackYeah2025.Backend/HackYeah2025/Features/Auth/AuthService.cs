using HackYeah2025.Infrastructure;
using HackYeah2025.Infrastructure.Models;
using HackYeah2025.Infrastructure.Options;
using HackYeah2025.Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;

namespace HackYeah2025.Features.Auth;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken);
    Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken);
}

public class AuthService : IAuthService
{
    private readonly HackYeahDbContext _dbContext;
    private readonly JwtOptions _jwtOptions;
    private readonly TimeProvider _timeProvider;

    public AuthService(HackYeahDbContext dbContext, IOptions<JwtOptions> jwtOptions, TimeProvider timeProvider)
    {
        _dbContext = dbContext;
        _jwtOptions = jwtOptions.Value;
        _timeProvider = timeProvider;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken)
    {
        string normalizedLogin = request.Login.Trim();
        string normalizedEmail = request.Email.Trim().ToLowerInvariant();
        RegistrationAccountType? accountType = ParseAccountType(request.AccountType);

        EnsureSingleProfileSelection(request, accountType);

        bool loginExists = await _dbContext.Accounts.AnyAsync(a => a.Login == normalizedLogin, cancellationToken);
        if (loginExists)
        {
            throw new InvalidOperationException("LoginAlreadyExists");
        }

        bool emailExists = await _dbContext.Accounts.AnyAsync(a => a.Email == normalizedEmail, cancellationToken);
        if (emailExists)
        {
            throw new InvalidOperationException("EmailAlreadyExists");
        }

        Guid? volunteerId = request.VolunteerId;
        Guid? organizerId = request.OrganizerId;
        Guid? coordinatorId = request.CoordinatorId;

        Volunteer? volunteer = null;
        if (volunteerId.HasValue)
        {
            volunteer = await _dbContext.Volunteers.Include(v => v.Account).FirstOrDefaultAsync(v => v.Id == volunteerId.Value, cancellationToken);
            if (volunteer is null)
            {
                throw new InvalidOperationException("VolunteerNotFound");
            }

            if (volunteer.Account is not null)
            {
                throw new InvalidOperationException("VolunteerAlreadyLinked");
            }
        }

        Organizer? organizer = null;
        if (organizerId.HasValue)
        {
            organizer = await _dbContext.Organizers.Include(o => o.Account).FirstOrDefaultAsync(o => o.Id == organizerId.Value, cancellationToken);
            if (organizer is null)
            {
                throw new InvalidOperationException("OrganizerNotFound");
            }

            if (organizer.Account is not null)
            {
                throw new InvalidOperationException("OrganizerAlreadyLinked");
            }
        }

        Coordinator? coordinator = null;
        if (coordinatorId.HasValue)
        {
            coordinator = await _dbContext.Coordinators.Include(c => c.Account).FirstOrDefaultAsync(c => c.Id == coordinatorId.Value, cancellationToken);
            if (coordinator is null)
            {
                throw new InvalidOperationException("CoordinatorNotFound");
            }

            if (coordinator.Account is not null)
            {
                throw new InvalidOperationException("CoordinatorAlreadyLinked");
            }
        }

        if (accountType is null)
        {
            accountType = InferAccountType(volunteerId, organizerId, coordinatorId, request);
        }

        if (accountType == RegistrationAccountType.Volunteer && !volunteerId.HasValue)
        {
            VolunteerRegistration profile = request.VolunteerProfile ?? throw new InvalidOperationException("VolunteerProfileRequired");
            string volunteerEmail = string.IsNullOrWhiteSpace(profile.Email) ? normalizedEmail : profile.Email.Trim().ToLowerInvariant();
            string volunteerPhone = NormalizeOrThrow(profile.Phone, "VolunteerPhoneRequired");

            volunteer = new Volunteer
            {
                Id = Guid.NewGuid(),
                FirstName = profile.FirstName.Trim(),
                LastName = profile.LastName.Trim(),
                Description = profile.Description.Trim(),
                Availability = CreateDictionaryFromText(profile.Availability, "availability"),
                PreferredRoles = EnsureValueOrFallback(profile.PreferredRoles, "Do ustalenia"),
                Languages = CreateDictionaryFromText(profile.Languages, "language"),
                Transport = EnsureValueOrFallback(profile.Transport, "Do ustalenia"),
                Skills = CreateDictionaryFromText(profile.Skills, "skill"),
                Email = volunteerEmail,
                Phone = volunteerPhone
            };

            _dbContext.Volunteers.Add(volunteer);
            volunteerId = volunteer.Id;
        }

        Organization? organization = null;
        if (accountType == RegistrationAccountType.Organizer && !organizerId.HasValue)
        {
            OrganizerRegistration organizerProfile = request.OrganizerProfile ?? throw new InvalidOperationException("OrganizerProfileRequired");
            OrganizationRegistration organizationProfile = organizerProfile.Organization ?? throw new InvalidOperationException("OrganizationProfileRequired");

            if (!int.TryParse(organizationProfile.FoundedYear, NumberStyles.Integer, CultureInfo.InvariantCulture, out int foundedYear))
            {
                throw new InvalidOperationException("InvalidOrganizationFoundedYear");
            }

            organization = new Organization
            {
                Id = Guid.NewGuid(),
                Name = organizationProfile.Name.Trim(),
                FoundedYear = foundedYear,
                Location = organizationProfile.Location.Trim(),
                Programs = organizationProfile.Programs.Trim(),
                Mission = organizationProfile.Mission.Trim(),
                Website = organizationProfile.Website.Trim()
            };

            _dbContext.Organizations.Add(organization);

            string organizerEmail = string.IsNullOrWhiteSpace(organizerProfile.Email) ? normalizedEmail : organizerProfile.Email.Trim().ToLowerInvariant();

            organizer = new Organizer
            {
                Id = Guid.NewGuid(),
                OrganizationId = organization.Id,
                FullName = organizerProfile.FullName.Trim(),
                Role = organizerProfile.Role.Trim(),
                Phone = EnsureValueOrFallback(organizerProfile.Phone, "Do ustalenia"),
                Email = organizerEmail,
                Languages = EnsureValueOrFallback(organizerProfile.Languages, "Do ustalenia"),
                Specializations = EnsureValueOrFallback(organizerProfile.Specializations, "Do ustalenia"),
                Organization = organization
            };

            _dbContext.Organizers.Add(organizer);
            organizerId = organizer.Id;
        }

        if (accountType == RegistrationAccountType.Coordinator && !coordinatorId.HasValue)
        {
            CoordinatorRegistration coordinatorProfile = request.CoordinatorProfile ?? throw new InvalidOperationException("CoordinatorProfileRequired");

            coordinator = new Coordinator
            {
                Id = Guid.NewGuid(),
                FirstName = coordinatorProfile.FirstName.Trim(),
                LastName = coordinatorProfile.LastName.Trim(),
                Description = coordinatorProfile.Description.Trim()
            };

            _dbContext.Coordinators.Add(coordinator);
            coordinatorId = coordinator.Id;
        }

        List<string> requestedRoles = request.Roles.Count > 0 ? request.Roles : GetDefaultRoles(accountType, volunteerId, organizerId, coordinatorId);
        HashSet<string> normalizedRoles = requestedRoles
            .Select(r => r.Trim())
            .Where(r => !string.IsNullOrWhiteSpace(r))
            .ToHashSet(StringComparer.InvariantCultureIgnoreCase);

        if (normalizedRoles.Count == 0)
        {
            normalizedRoles.UnionWith(GetDefaultRoles(accountType, volunteerId, organizerId, coordinatorId));
        }

        List<Role> roles = await _dbContext.Roles
            .Where(r => normalizedRoles.Contains(r.Name))
            .ToListAsync(cancellationToken);

        if (roles.Count != normalizedRoles.Count)
        {
            throw new InvalidOperationException("RoleNotFound");
        }

        Account account = new()
        {
            Id = Guid.NewGuid(),
            Login = normalizedLogin,
            Email = normalizedEmail,
            PasswordHash = PasswordHasher.Hash(request.Password),
            IsActive = true,
            VolunteerId = volunteerId,
            OrganizerId = organizerId,
            CoordinatorId = coordinatorId,
            AccountRoles = roles.Select(role => new AccountRole
            {
                RoleId = role.Id
            }).ToList()
        };

        _dbContext.Accounts.Add(account);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return CreateResponse(account, roles);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken)
    {
        Account? account = await _dbContext.Accounts
            .Include(a => a.AccountRoles)
            .ThenInclude(ar => ar.Role)
            .FirstOrDefaultAsync(a => a.Login == request.Login.Trim(), cancellationToken);

        if (account is null)
        {
            throw new InvalidOperationException("InvalidCredentials");
        }

        if (!account.IsActive)
        {
            throw new InvalidOperationException("AccountInactive");
        }

        bool passwordValid = PasswordHasher.Verify(request.Password, account.PasswordHash);
        if (!passwordValid)
        {
            throw new InvalidOperationException("InvalidCredentials");
        }

        List<Role> roles = account.AccountRoles.Select(ar => ar.Role).ToList();
        return CreateResponse(account, roles);
    }

    private AuthResponse CreateResponse(Account account, IReadOnlyCollection<Role> roles)
    {
        DateTimeOffset now = _timeProvider.GetUtcNow();
        DateTimeOffset expires = now.AddMinutes(_jwtOptions.ExpiryMinutes);

        if (string.IsNullOrWhiteSpace(_jwtOptions.SecretKey))
        {
            throw new InvalidOperationException("JwtSecretMissing");
        }

        SymmetricSecurityKey securityKey = new(Encoding.UTF8.GetBytes(_jwtOptions.SecretKey));
        SigningCredentials signingCredentials = new(securityKey, SecurityAlgorithms.HmacSha256);

        List<Claim> claims = new()
        {
            new(JwtRegisteredClaimNames.Sub, account.Id.ToString()),
            new(JwtRegisteredClaimNames.UniqueName, account.Login),
            new(JwtRegisteredClaimNames.Email, account.Email)
        };

        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role.Name)));

        JwtSecurityToken token = new(
            issuer: _jwtOptions.Issuer,
            audience: _jwtOptions.Audience,
            expires: expires.UtcDateTime,
            claims: claims,
            signingCredentials: signingCredentials
        );

        string serializedToken = new JwtSecurityTokenHandler().WriteToken(token);

        return new AuthResponse
        {
            AccountId = account.Id,
            Token = serializedToken,
            ExpiresAt = expires.UtcDateTime,
            Login = account.Login,
            Email = account.Email,
            Roles = roles.Select(role => role.Name).ToList()
        };
    }

    private static void EnsureSingleProfileSelection(RegisterRequest request, RegistrationAccountType? accountType)
    {
        int selections = 0;

        if (request.VolunteerId.HasValue || request.VolunteerProfile is not null || accountType == RegistrationAccountType.Volunteer)
        {
            selections++;
        }

        if (request.OrganizerId.HasValue || request.OrganizerProfile is not null || accountType == RegistrationAccountType.Organizer)
        {
            selections++;
        }

        if (request.CoordinatorId.HasValue || request.CoordinatorProfile is not null || accountType == RegistrationAccountType.Coordinator)
        {
            selections++;
        }

        if (selections > 1)
        {
            throw new InvalidOperationException("MultipleProfilesNotSupported");
        }
    }

    private static RegistrationAccountType? InferAccountType(Guid? volunteerId, Guid? organizerId, Guid? coordinatorId, RegisterRequest request)
    {
        if (volunteerId.HasValue || request.VolunteerProfile is not null)
        {
            return RegistrationAccountType.Volunteer;
        }

        if (organizerId.HasValue || request.OrganizerProfile is not null)
        {
            return RegistrationAccountType.Organizer;
        }

        if (coordinatorId.HasValue || request.CoordinatorProfile is not null)
        {
            return RegistrationAccountType.Coordinator;
        }

        return null;
    }

    private static RegistrationAccountType? ParseAccountType(string accountType)
    {
        if (string.IsNullOrWhiteSpace(accountType))
        {
            return null;
        }

        return accountType.Trim().ToLowerInvariant() switch
        {
            "wolontariusz" or "volunteer" => RegistrationAccountType.Volunteer,
            "organizator" or "organizer" => RegistrationAccountType.Organizer,
            "koordynator" or "coordinator" => RegistrationAccountType.Coordinator,
            _ => throw new InvalidOperationException("AccountTypeNotSupported")
        };
    }

    private static List<string> GetDefaultRoles(RegistrationAccountType? accountType, Guid? volunteerId, Guid? organizerId, Guid? coordinatorId)
    {
        if (accountType == RegistrationAccountType.Organizer || organizerId.HasValue)
        {
            return new List<string> { DbRoleEntityTypeConfiguration.Organizer.Name };
        }

        if (accountType == RegistrationAccountType.Coordinator || coordinatorId.HasValue)
        {
            return new List<string> { DbRoleEntityTypeConfiguration.Coordinator.Name };
        }

        return new List<string> { DbRoleEntityTypeConfiguration.Volunteer.Name };
    }

    private static Dictionary<string, string> CreateDictionaryFromText(string value, string prefix)
    {
        Dictionary<string, string> dictionary = new(StringComparer.InvariantCultureIgnoreCase);

        if (string.IsNullOrWhiteSpace(value))
        {
            dictionary[$"{prefix}_1"] = "Do ustalenia";
            return dictionary;
        }

        string[] segments = value
            .Split(new[] { '\n', ',' }, StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

        if (segments.Length == 0)
        {
            dictionary[$"{prefix}_1"] = value.Trim();
            return dictionary;
        }

        for (int index = 0; index < segments.Length; index++)
        {
            dictionary[$"{prefix}_{index + 1}"] = segments[index];
        }

        return dictionary;
    }

    private static string EnsureValueOrFallback(string value, string fallback)
    {
        return string.IsNullOrWhiteSpace(value) ? fallback : value.Trim();
    }

    private static string NormalizeOrThrow(string value, string errorCode)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new InvalidOperationException(errorCode);
        }

        return value.Trim();
    }

    private enum RegistrationAccountType
    {
        Volunteer,
        Organizer,
        Coordinator
    }
}
