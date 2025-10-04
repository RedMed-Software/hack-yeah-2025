namespace HackYeah2025.Features;

using HackYeah2025.Infrastructure;
using HackYeah2025.Infrastructure.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/events")]
public sealed class EventAccountController : ControllerBase
{
    private readonly HackYeahDbContext _dbContext;

    public EventAccountController(HackYeahDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // POST api/events/{eventId}/assign
    [HttpPost("{eventId:guid}/assign")]
    public async Task<ActionResult> AssignUserToEvent(Guid eventId, [FromBody] EventAccountAssignDto dto)
    {
        bool exists = await _dbContext.EventsAccounts
            .AnyAsync(x => x.EventId == eventId && x.AccountId == dto.AccountId);

        if (exists)
            return BadRequest(new { message = "Użytkownik już przypisany do eventu." });

        bool eventExists = await _dbContext.Events.AnyAsync(e => e.Id == eventId);
        bool accountExists = await _dbContext.Accounts.AnyAsync(a => a.Id == dto.AccountId);

        if (!eventExists || !accountExists)
            return NotFound(new { message = "Event lub użytkownik nie istnieje." });

        _dbContext.EventsAccounts.Add(new EventsAccount
        {
            EventId = eventId,
            AccountId = dto.AccountId
        });

        await _dbContext.SaveChangesAsync();
        return NoContent();
    }

    // GET api/events/{eventId}/users
    [HttpGet("{eventId:guid}/users")]
    public async Task<ActionResult<IEnumerable<EventAccountUserDto>>> GetEventUsers(Guid eventId)
    {
        List<EventAccountUserDto> users = await _dbContext.EventsAccounts
            .Where(ea => ea.EventId == eventId)
            .Include(ea => ea.Account)
            .Select(ea => new EventAccountUserDto
            {
                AccountId = ea.Account!.Id,
                Login = ea.Account.Login,
                Email = ea.Account.Email
            })
            .ToListAsync();

        return Ok(users);
    }
}

public sealed record EventAccountAssignDto
{
    public Guid AccountId { get; set; }
}

public sealed record EventAccountUserDto
{
    public Guid AccountId { get; set; }
    public string Login { get; set; } = default!;
    public string Email { get; set; } = default!;
}