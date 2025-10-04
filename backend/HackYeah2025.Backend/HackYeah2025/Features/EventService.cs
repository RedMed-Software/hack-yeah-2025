using HackYeah2025.Infrastructure;
using HackYeah2025.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace HackYeah2025.Features;

public interface IEventService
{
    Task<Event?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<List<Event>> GetByOrganizerIdAsync(Guid organizationId, CancellationToken cancellationToken = default);
    Task<Guid> CreateEvent(Event @event, CancellationToken cancellationToken = default);
    Task CompleteEventAsync(Guid eventId, CancellationToken cancellationToken = default);
}

public class EventService : IEventService
{
    private readonly HackYeahDbContext _dbContext;

    public EventService(HackYeahDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Guid> CreateEvent(Event @event, CancellationToken cancellationToken = default)
    {
        if (@event is null)
        {
            return Guid.Empty;
        }

        Guid eventId = Guid.NewGuid();
        @event.Id = eventId;
        @event.EventStatus = Infrastructure.Enums.EventStatus.Register;
        @event.RegisterDate = DateTimeOffset.UtcNow;

        await _dbContext.Events.AddAsync(@event, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return eventId; 
    }

    public async Task CompleteEventAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        Event @event = await _dbContext.Events.FirstOrDefaultAsync(e => e.Id == eventId);

        if (@event is null)
        {
            return;
        }

        //change if status flow will be change 
        if (@event.EventStatus != Infrastructure.Enums.EventStatus.Register)
        {
            return;
        }

        @event.EventStatus = Infrastructure.Enums.EventStatus.Completed;
        @event.CompletedDate = DateTimeOffset.UtcNow;

        await _dbContext.SaveChangesAsync();
    }

    public async Task<Event?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Events
            .Include(e => e.EventEventTopics)
                .ThenInclude(eet => eet.EventTopic)
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
    }

    public async Task<List<Event>> GetByOrganizerIdAsync(Guid organizerId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Events
            .Include(e => e.EventEventTopics)
                .ThenInclude(eet => eet.EventTopic)
            .AsNoTracking()
            .Where(e => e.OrganizerId == organizerId)
            .ToListAsync(cancellationToken);
    }

    public async Task CompleteEvent(Guid eventId, CancellationToken cancellationToken = default)
    {
        Event @event = await _dbContext.Events.FirstOrDefaultAsync(e => e.Id == eventId);

        if (@event is null)
        {
            return;
        }

        //change if status flow will be change 
        if (@event.EventStatus != Infrastructure.Enums.EventStatus.Register)
        {
            return;
        }

        @event.EventStatus = Infrastructure.Enums.EventStatus.Completed;
        @event.CompletedDate = DateTimeOffset.UtcNow;

        await _dbContext.SaveChangesAsync();
    }
}
