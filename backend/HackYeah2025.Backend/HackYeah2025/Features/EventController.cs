using System.Security.Claims;
using HackYeah2025.Infrastructure.Enums;
using HackYeah2025.Infrastructure.Models;
using Microsoft.AspNetCore.Mvc;

namespace HackYeah2025.Features;

[ApiController]
[Route("api/[controller]")]
public class EventController(
    IEventService eventService,
    IOrganizerService organizerService
) : ControllerBase
{
    [HttpPost("search")]
    public async Task<ActionResult<List<Event>>> SearchAsync([FromBody] SearchEvents searchEvents, CancellationToken cancellationToken)
    {
        List<Event> events = await eventService.SearchAsync(searchEvents, cancellationToken);

        List<EventDto> eventDtos = events.Select(@event => new EventDto
        {
            Id = @event.Id,
            Name = @event.Name,
            ShortDescription = @event.ShortDescription,
            LongDescription = @event.LongDescription,
            DateFrom = @event.DateFrom,
            DateTo = @event.DateTo,
            Place = @event.Place,
            City = @event.City,
            Address = @event.Address,
            Latitude = @event.Latitude,
            Longitude = @event.Longitude,
            EventStatus = @event.EventStatus
        }).ToList();

        return Ok(eventDtos);
    }

    [HttpGet("{eventId:guid}")]
    public async Task<ActionResult<Event>> GetByIdAsync(Guid eventId, CancellationToken cancellationToken)
    {
        Event? @event = await eventService.GetByIdAsync(eventId, cancellationToken);
        if (@event is null)
        {
            return NotFound();
        }

        EventDto dto = new()
        {
            Id = @event.Id,
            Name = @event.Name,
            ShortDescription = @event.ShortDescription,
            LongDescription = @event.LongDescription,
            DateFrom = @event.DateFrom,
            DateTo = @event.DateTo,
            Place = @event.Place,
            City = @event.City,
            Address = @event.Address,
            Latitude = @event.Latitude,
            Longitude = @event.Longitude,
            EventStatus = @event.EventStatus
        };

        return Ok(@event);
    }

    [HttpGet("by-organizer-id/{organizerId:guid}")]
    public async Task<ActionResult<List<EventDto>>> GetByOrganizerIdAsync(Guid organizerId, CancellationToken cancellationToken)
    {
        List<Event> events = await eventService.GetByOrganizerIdAsync(organizerId, cancellationToken);

        List<EventDto> eventDtos = events.Select(@event => new EventDto
        {
            Id = @event.Id,
            Name = @event.Name,
            ShortDescription = @event.ShortDescription,
            LongDescription = @event.LongDescription,
            DateFrom = @event.DateFrom,
            DateTo = @event.DateTo,
            Place = @event.Place,
            City = @event.City,
            Address = @event.Address,
            Latitude = @event.Latitude,
            Longitude = @event.Longitude,
            EventStatus = @event.EventStatus,
        }).ToList();

        return Ok(eventDtos);
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> CreateEvent([FromBody] EventDto dto, CancellationToken cancellationToken)
    {
        string? accountIdString = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("No account id in claims");

        Guid accountId = Guid.Parse(accountIdString);

        // TODO: check role

        Organizer? organizer = await organizerService.GetByAccountIdAsync(accountId, cancellationToken);

        if (organizer is null)
        {
            return NotFound("Organizer not found");
        }

        Event @event = new()
        {
            Id = Guid.NewGuid(), // generujemy nowy Id
            Name = dto.Name,
            ShortDescription = dto.ShortDescription,
            LongDescription = dto.LongDescription,
            DateFrom = dto.DateFrom,
            DateTo = dto.DateTo,
            Place = dto.Place,
            City = dto.City,
            Address = dto.Address,
            Latitude = dto.Latitude,
            Longitude = dto.Longitude,
            OrganizerId = organizer.Id,
            RegisterDate = DateTimeOffset.UtcNow,
            EventStatus = EventStatus.Register
        };

        Guid result = await eventService.CreateEvent(@event, cancellationToken);
        return Ok(result);
    }

    [HttpPost("complete-event/{eventId:guid}")]
    public async Task<ActionResult<Guid>> CompleteEvent(Guid eventId, CancellationToken cancellationToken)
    {
        await eventService.CompleteEventAsync(eventId, cancellationToken);
        return Ok();
    }
}

public sealed record EventDto
{
    public required Guid Id { get; init; }
    public required string Name { get; set; }
    public string? ShortDescription { get; set; }
    public string? LongDescription { get; set; }
    public required DateTimeOffset DateFrom { get; set; }
    public DateTimeOffset? DateTo { get; set; }
    public string? Place { get; set; }
    public string? City { get; set; }
    public string? Address { get; set; }
    public required decimal Latitude { get; set; }
    public required decimal Longitude { get; set; }
    public required EventStatus EventStatus { get; set; }


    // TODO: event topics?
}