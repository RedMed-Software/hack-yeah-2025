using HackYeah2025.Infrastructure.Models;
using Microsoft.AspNetCore.Mvc;

namespace HackYeah2025.Features;

[ApiController]
[Route("api/[controller]")]
public class EventController : ControllerBase
{
    private readonly IEventService _eventService;

    public EventController(IEventService eventService)
    {
        _eventService = eventService;
    }

    [HttpGet("{eventId:guid}")]
    public async Task<ActionResult<Event>> Get(Guid eventId, CancellationToken cancellationToken)
    {
        Event? result = await _eventService.GetByIdAsync(eventId, cancellationToken);
        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }
}
