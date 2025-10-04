using HackYeah2025.Infrastructure.Models;
using Microsoft.AspNetCore.Mvc;
using System.Threading;

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

    [HttpPost("search")]
    public async Task<ActionResult<List<Event>>> SearchAsync([FromBody] SearchEvents searchEvents, CancellationToken cancellationToken)
    {
        List <Event> events = await _eventService.SearchAsync(searchEvents, cancellationToken);
        return Ok(events);
    }

    [HttpGet("{eventId:guid}")]
    public async Task<ActionResult<Event>> GetByIdAsync(Guid eventId, CancellationToken cancellationToken)
    {
        Event? result = await _eventService.GetByIdAsync(eventId, cancellationToken);
        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpGet("by-organizer-id/{organizerId:guid}")]
    public async Task<ActionResult<List<Event>>> GetByOrganizerIdAsync(Guid organizerId, CancellationToken cancellationToken)
    {
        List<Event> events = await _eventService.GetByOrganizerIdAsync(organizerId, cancellationToken);
        return Ok(events);
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> CreateEvent([FromBody] Event @event, CancellationToken cancellationToken)
    {
        Guid result = await _eventService.CreateEvent(@event, cancellationToken);
        return Ok(result);
    }

    [HttpPost("complete-event/{eventId:guid}")]
    public async Task<ActionResult<Guid>> CompleteEvent(Guid eventId, CancellationToken cancellationToken)
    {
        await _eventService.CompleteEventAsync(eventId, cancellationToken);
        return Ok();
    }
}
