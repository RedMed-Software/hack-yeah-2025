using HackYeah2025.Infrastructure;
using HackYeah2025.Infrastructure.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HackYeah2025.Features;

[Route("api/[controller]")]
[ApiController]
public class OrganizerController(
    HackYeahDbContext dbContext,
    IOrganizerService organizerService
) : ControllerBase
{
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Organizer>> Get(Guid id, CancellationToken cancellationToken)
    {
        Organizer? organizer = await organizerService.GetByIdAsync(id, cancellationToken);

        if (organizer is null)
        {
            return NotFound();
        }

        return Ok(organizer);
    }

    [HttpGet("{id:guid}/get-account-id")]
    public async Task<ActionResult<Guid>> GetAccountIdByOrganizerId(Guid id, CancellationToken cancellationToken)
    {
        Organizer? organizer = await dbContext.Organizers
            .Where(o => o.Id == id)
            .Include(o => o.Account)
            .FirstOrDefaultAsync(cancellationToken);

        if (organizer is null)
            return NotFound("Organizer or related account not found.");

        return Ok(organizer.Account.Id);
    }
}
