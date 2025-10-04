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
