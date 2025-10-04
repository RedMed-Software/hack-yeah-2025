using HackYeah2025.Infrastructure;
using HackYeah2025.Infrastructure.Models;
using HackYeah2025.Infrastructure.Options;
using HackYeah2025.Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
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

        if (request.VolunteerId.HasValue && request.OrganizerId.HasValue)
        {
            throw new InvalidOperationException("MultipleProfilesNotSupported");
        }

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

        Volunteer? volunteer = null;
        if (request.VolunteerId.HasValue)
        {
            volunteer = await _dbContext.Volunteers.Include(v => v.Account).FirstOrDefaultAsync(v => v.Id == request.VolunteerId.Value, cancellationToken);
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
        if (request.OrganizerId.HasValue)
        {
            organizer = await _dbContext.Organizers.Include(o => o.Account).FirstOrDefaultAsync(o => o.Id == request.OrganizerId.Value, cancellationToken);
            if (organizer is null)
            {
                throw new InvalidOperationException("OrganizerNotFound");
            }

            if (organizer.Account is not null)
            {
                throw new InvalidOperationException("OrganizerAlreadyLinked");
            }
        }

        List<string> requestedRoles = request.Roles.Count > 0 ? request.Roles : new List<string> { DbRoleEntityTypeConfiguration.Volunteer.Name };
        HashSet<string> normalizedRoles = requestedRoles
            .Select(r => r.Trim())
            .Where(r => !string.IsNullOrWhiteSpace(r))
            .ToHashSet(StringComparer.InvariantCultureIgnoreCase);

        if (normalizedRoles.Count == 0)
        {
            normalizedRoles.Add(DbRoleEntityTypeConfiguration.Volunteer.Name);
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
            VolunteerId = request.VolunteerId,
            OrganizerId = request.OrganizerId,
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
}
