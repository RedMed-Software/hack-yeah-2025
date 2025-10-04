using HackYeah2025.Infrastructure.Models;
using Microsoft.AspNetCore.Mvc;

namespace HackYeah2025.Features;

[Route("api/[controller]")]
[ApiController]
public class OrganizerController : ControllerBase
{
    private readonly IOrganizerService _organizerService;

    public OrganizerController(IOrganizerService organizerService)
    {
        _organizerService = organizerService;
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Organizer>> Get(Guid id, CancellationToken cancellationToken)
    {
        Organizer? organizer = await _organizerService.GetByIdAsync(id, cancellationToken);

        if (organizer is null)
        {
            return NotFound();
        }

        return Ok(organizer);
    }
}
