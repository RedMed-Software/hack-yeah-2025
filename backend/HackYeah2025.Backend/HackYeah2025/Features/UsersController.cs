using System.Security.Claims;
using HackYeah2025.Infrastructure;
using HackYeah2025.Infrastructure.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HackYeah2025.Features;

[ApiController]
[Route("api/[controller]")]
public sealed class UsersController(HackYeahDbContext dbContext) : ControllerBase
{
    [HttpGet()]
    public async Task<ActionResult<UserInfoDto>> GetCurrentUserAsync(CancellationToken cancellationToken = default)
    {
        string? accountIdString = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("No account id in claims");

        Guid accountId = Guid.Parse(accountIdString);

        Account? account = await dbContext.Accounts
            .Include(a => a.Volunteer)
            .Include(a => a.Organizer)
            .ThenInclude(a => a.Organization)
            .Include(a => a.Coordinator)
            .FirstOrDefaultAsync(a => a.Id == accountId, cancellationToken);

        if (account is null) return NotFound();

        var dto = new UserInfoDto
        {
            AccountId = account.Id,
            Login = account.Login,
            Email = account.Email,
            Volunteer = account.Volunteer,
            Organizer = account.Organizer,
            Coordinator = account.Coordinator
        };

        return Ok(dto);
    }

    [HttpGet("{accountId:guid}")]
    public async Task<ActionResult<UserInfoDto>> GetUserByAccountIdAsync(Guid accountId, CancellationToken cancellationToken = default)
    {
        Account? account = await dbContext.Accounts
            .Include(a => a.Volunteer)
            .Include(a => a.Organizer)
            .ThenInclude(a => a.Organization)
            .Include(a => a.Coordinator)
            .FirstOrDefaultAsync(a => a.Id == accountId, cancellationToken);

        if (account is null) return NotFound();

        var dto = new UserInfoDto
        {
            AccountId = account.Id,
            Login = account.Login,
            Email = account.Email,
            Volunteer = account.Volunteer,
            Organizer = account.Organizer,
            Coordinator = account.Coordinator
        };

        return Ok(dto);
    }
}

public sealed record UserInfoDto
{
    public Guid AccountId { get; set; }
    public string Login { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    public Volunteer? Volunteer { get; set; }
    public Organizer? Organizer { get; set; }
    public Coordinator? Coordinator { get; set; }
}