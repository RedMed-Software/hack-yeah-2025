using System.Security.Claims;
using HackYeah2025.Infrastructure;
using HackYeah2025.Infrastructure.Enums;
using HackYeah2025.Infrastructure.Models;
using Microsoft.AspNetCore.Mvc;

namespace HackYeah2025.Features;

[ApiController]
[Route("api/[controller]")]
public class EventController(
    IEventService eventService,
    IOrganizerService organizerService,
    HackYeahDbContext dbContext,
    IUserService userService
) : ControllerBase
{
    [HttpPost("search")]
    public async Task<ActionResult<List<EventDto>>> SearchAsync([FromBody] SearchEvents searchEvents, CancellationToken cancellationToken)
    {
        List<Event> events = await eventService.SearchAsync(searchEvents, cancellationToken);

        List<EventDto> eventDtos = events.Select(ToDto).ToList();

        return Ok(eventDtos);
    }

    [HttpGet("{eventId:guid}")]
    public async Task<ActionResult<EventDto>> GetByIdAsync(Guid eventId, CancellationToken cancellationToken)
    {
        Event? @event = await eventService.GetByIdAsync(eventId, cancellationToken);
        if (@event is null)
            return NotFound();

        string? accountIdString = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("No account id in claims");

        Guid accountId = Guid.Parse(accountIdString);
        Account account = await userService.GetByAccountIdAsync(accountId);

        List<Volunteer>? volunteers = null;
        List<Coordinator>? coordinators = null;

        if (account.Coordinator is not null || account.Organizer is not null)
        {
            List<Account> accounts = await eventService.GetAccountsByEventIdAsync(eventId, cancellationToken);
            volunteers = accounts.Where(a => a.Volunteer != null).Select(a => a.Volunteer!).ToList();
            coordinators = accounts.Where(a => a.Coordinator != null).Select(a => a.Coordinator!).ToList();
        }

        EventDto dto = ToDto(@event);

        return Ok(dto with
        {
            Volunteers = volunteers,
            Coordinators = coordinators,
            Organizer = account.Organizer
        });
    }

    [HttpGet("by-organizer-id/{organizerId:guid}")]
    public async Task<ActionResult<List<EventDto>>> GetByOrganizerIdAsync(Guid organizerId, CancellationToken cancellationToken)
    {
        List<Event> events = await eventService.GetByOrganizerIdAsync(organizerId, cancellationToken);
        return Ok(events.Select(ToDto).ToList());
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> CreateEvent([FromBody] CreateEvent dto, CancellationToken cancellationToken)
    {
        string? accountIdString = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("No account id in claims");

        Guid accountId = Guid.Parse(accountIdString);

        Organizer? organizer = await organizerService.GetByAccountIdAsync(accountId, cancellationToken);
        if (organizer is null)
            return NotFound("Organizer not found");

        Event @event = new()
        {
            Id = Guid.NewGuid(),
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
            EventStatus = EventStatus.Register,
            TimeFrom = dto.TimeFrom,
            FocusAreas = dto.FocusAreas,
            MaxParticipants = dto.ParticipantsCapacity,
            MaxVolunteers = dto.VolunteersCapacity,
            TimeTo = dto.TimeTo,
        };

        List<TaskItem> taskItems = dto.Tasks.Select(t => new TaskItem()
        {
            Id = Guid.NewGuid(),
            DateStart = t.DateStart,
            DateEnd = t.DateEnd,
            Description = t.Description,
            EventId = @event.Id,
            Title = t.Title,
            TimeTo = t.TimeTo,
            TimeFrom = t.TimeFrom,
            Additional = t.Additional,
            Experience = t.Experience,
            Location = t.Location,
            MinAge = t.MinAge,
            Skills = t.Skills,
        }).ToList();

        dbContext.TaskItems.AddRange(taskItems);

        Guid result = await eventService.CreateEvent(@event, cancellationToken);
        return Ok(result);
    }

    [HttpPost("complete-event/{eventId:guid}")]
    public async Task<ActionResult> CompleteEvent(Guid eventId, CancellationToken cancellationToken)
    {
        string? accountIdString = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("No account id in claims");

        Guid accountId = Guid.Parse(accountIdString);

        Organizer? organizer = await organizerService.GetByAccountIdAsync(accountId, cancellationToken);
        if (organizer is null)
            return NotFound("Organizer not found");

        await eventService.CompleteEventAsync(eventId, cancellationToken);
        return Ok();
    }

    private static EventDto ToDto(Event e) => new()
    {
        Id = e.Id,
        Name = e.Name,
        Summary = e.ShortDescription,
        Description = e.LongDescription,
        Dates = new EventDates 
        {
            Start = e.DateFrom,
            End = e.DateTo
        },
        Capacity = new EventCapacity
        {
            Participants = e.MaxParticipants,
            Volunteers = e.MaxVolunteers,
        },
        FocusAreas = e.FocusAreas,
        MainLocation = new EventLocation
        {
            Address = e.Address,
            City = e.City,
            Venue = e.Place
        },
        Status = e.EventStatus,
        Tasks = e.TaskItems.Select(t => new EventTaskDto
        {
            Id = t.Id,
            Title = t.Title,
            Description = t.Description,
            DateFrom = t.DateStart,
            DateTo = t.DateEnd,
            TimeFrom = t.TimeFrom,
            TimeTo = t.TimeTo,
            Location = t.Location,
            Additional = t.Additional,
            Experience = t.Experience,
            MinAge = t.MinAge,
            Skills = t.Skills,
        }).ToList(),
        TimeFrom = e.TimeFrom,
        TimeTo = e.TimeTo,
        Latitude = e.Latitude,
        Longitude = e.Longitude,
        EventStatus = e.EventStatus,
    };
}

public sealed record CreateEvent
{
    public required string Name { get; init; }
    public string? ShortDescription { get; init; }
    public string? LongDescription { get; init; }
    public required DateTimeOffset DateFrom { get; init; }
    public DateTimeOffset? DateTo { get; init; }
    public TimeOnly? TimeFrom { get; init; }
    public TimeOnly? TimeTo { get; init; }
    public string? Place { get; init; }
    public string? City { get; init; }
    public string? Address { get; init; }
    public decimal Latitude { get; init; }
    public decimal Longitude { get; init; }
    public string? FocusAreas { get; init; }
    public int? ParticipantsCapacity { get; init; }
    public int? VolunteersCapacity { get; init; }
    public List<CreateTaskItem> Tasks { get; init; } = [];
}

public sealed record CreateTaskItem
{
    public required string Title { get; init; }
    public string? Description { get; init; }
    public string? Location { get; init; }
    public DateTimeOffset? DateStart { get; init; }
    public DateTimeOffset? DateEnd { get; init; }
    public TimeOnly? TimeFrom { get; init; }
    public TimeOnly? TimeTo { get; init; }
    public string? Additional { get; init; }
    public string? Experience { get; init; }
    public int? MinAge { get; init; }
    public string? Skills { get; init; }
}

public sealed record EventDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public EventStatus? Status { get; init; }
    public string? Summary { get; init; }
    public string? Description { get; init; }
    public EventDates? Dates { get; init; }
    public TimeOnly? TimeFrom { get; init; }
    public TimeOnly? TimeTo { get; init; }
    public EventLocation? MainLocation { get; init; }
    public string? FocusAreas { get; init; }
    public EventCapacity? Capacity { get; init; }
    //public int Registrations { get; init; }
    public List<EventTaskDto> Tasks { get; init; } = [];
    public decimal Latitude { get; internal set; }
    public decimal Longitude { get; internal set; }
    public EventStatus EventStatus { get; internal set; }
    public Organizer? Organizer { get; set; }
    public List<Volunteer>? Volunteers { get; set; }
    public List<Coordinator>? Coordinators { get; set; }
}

public sealed record EventDates
{
    public required DateTimeOffset Start { get; init; }
    public DateTimeOffset? End { get; init; }
}

public sealed record EventLocation
{
    public string? Venue { get; init; }
    public string? City { get; init; }
    public string? Address { get; init; }
}

public sealed record EventCapacity
{
    public int? Participants { get; init; }
    public int? Volunteers { get; init; }
}

public sealed record EventTaskDto
{
    public Guid Id { get; init; }
    public required string Title { get; init; }
    public string? Description { get; init; }
    public string? Location { get; init; }
    public DateTimeOffset? DateFrom { get; init; }
    public DateTimeOffset? DateTo { get; init; }
    public TimeOnly? TimeFrom { get; init; }
    public TimeOnly? TimeTo { get; init; }
    public int? MinAge { get; init; }
    public string? Skills { get; init; }
    public string? Experience { get; init; }
    public string? Additional { get; init; }
}