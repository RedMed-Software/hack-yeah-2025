using System.ComponentModel.DataAnnotations;

namespace HackYeah2025.Features.Auth;

public record RegisterRequest
{
    [Required]
    [MaxLength(128)]
    public string Login { get; init; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(256)]
    public string Email { get; init; } = string.Empty;

    [Required]
    [MinLength(8)]
    public string Password { get; init; } = string.Empty;

    public List<string> Roles { get; init; } = new();

    public Guid? VolunteerId { get; init; }

    public Guid? OrganizerId { get; init; }

    public Guid? CoordinatorId { get; init; }

    [MaxLength(64)]
    public string AccountType { get; init; } = string.Empty;

    public VolunteerRegistration? VolunteerProfile { get; init; }

    public OrganizerRegistration? OrganizerProfile { get; init; }

    public CoordinatorRegistration? CoordinatorProfile { get; init; }
}

public record VolunteerRegistration
{
    [Required]
    [MaxLength(128)]
    public string FirstName { get; init; } = string.Empty;

    [Required]
    [MaxLength(128)]
    public string LastName { get; init; } = string.Empty;

    [Required]
    [MaxLength(1024)]
    public string Description { get; init; } = string.Empty;

    [MaxLength(512)]
    public string PreferredRoles { get; init; } = string.Empty;

    [MaxLength(512)]
    public string Availability { get; init; } = string.Empty;

    [MaxLength(512)]
    public string Languages { get; init; } = string.Empty;

    [MaxLength(512)]
    public string Skills { get; init; } = string.Empty;

    [MaxLength(256)]
    public string Transport { get; init; } = string.Empty;

    [MaxLength(256)]
    public string Email { get; init; } = string.Empty;

    [MaxLength(64)]
    public string Phone { get; init; } = string.Empty;
}

public record OrganizerRegistration
{
    [Required]
    [MaxLength(256)]
    public string FullName { get; init; } = string.Empty;

    [Required]
    [MaxLength(256)]
    public string Role { get; init; } = string.Empty;

    [MaxLength(64)]
    public string Phone { get; init; } = string.Empty;

    [MaxLength(256)]
    public string Email { get; init; } = string.Empty;

    [MaxLength(256)]
    public string Languages { get; init; } = string.Empty;

    [MaxLength(512)]
    public string Specializations { get; init; } = string.Empty;

    [Required]
    public OrganizationRegistration? Organization { get; init; }
}

public record OrganizationRegistration
{
    [Required]
    [MaxLength(256)]
    public string Name { get; init; } = string.Empty;

    [Required]
    [MaxLength(16)]
    public string FoundedYear { get; init; } = string.Empty;

    [Required]
    [MaxLength(512)]
    public string Location { get; init; } = string.Empty;

    [Required]
    [MaxLength(1024)]
    public string Programs { get; init; } = string.Empty;

    [Required]
    [MaxLength(1024)]
    public string Mission { get; init; } = string.Empty;

    [Required]
    [MaxLength(256)]
    public string Website { get; init; } = string.Empty;
}

public record CoordinatorRegistration
{
    [Required]
    [MaxLength(128)]
    public string FirstName { get; init; } = string.Empty;

    [Required]
    [MaxLength(128)]
    public string LastName { get; init; } = string.Empty;

    [Required]
    [MaxLength(1024)]
    public string Description { get; init; } = string.Empty;
}

public record LoginRequest
{
    [Required]
    public string Login { get; init; } = string.Empty;

    [Required]
    public string Password { get; init; } = string.Empty;
}

public record AuthResponse
{
    public required Guid AccountId { get; init; }
    public required string Token { get; init; }
    public required DateTime ExpiresAt { get; init; }
    public required string Login { get; init; }
    public required string Email { get; init; }
    public required IReadOnlyCollection<string> Roles { get; init; }
}
