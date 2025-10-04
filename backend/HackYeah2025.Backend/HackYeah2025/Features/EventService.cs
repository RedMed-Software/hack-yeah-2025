using HackYeah2025.Infrastructure;
using HackYeah2025.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace HackYeah2025.Features;

public interface IEventService
{
    Task<Event?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<List<Event>> GetByOrganizerIdAsync(Guid organizationId, CancellationToken cancellationToken = default);
    Task<List<Event>> SearchAsync(SearchEvents searchEvents, CancellationToken cancellationToken = default);
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

    public Task<List<Event>> SearchAsync(SearchEvents searchEvents, CancellationToken cancellationToken = default)
    {
        var query = _dbContext.Events.AsQueryable();

        if (searchEvents.OrganizerId.HasValue)
        {
            query = query.Where(o => o.OrganizerId == searchEvents.OrganizerId);
        }

        if (searchEvents.EventStatus.HasValue)
        {
            query = query.Where(o => o.EventStatus == searchEvents.EventStatus);
        }

        if (searchEvents.Query is not null)
        {
            query = query.Where(q => 
                q.Name.Contains(searchEvents.Query) 
                || (q.ShortDescription != null && q.ShortDescription.Contains(searchEvents.Query))
                || (q.LongDescription != null && q.LongDescription.Contains(searchEvents.Query))
                || (q.Place != null && q.Place.Contains(searchEvents.Query))
                || (q.Address != null && q.Address.Contains(searchEvents.Query))
                || (q.City != null && q.City.Contains(searchEvents.Query))
            );
        }

        return query.ToListAsync(cancellationToken);
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
}
