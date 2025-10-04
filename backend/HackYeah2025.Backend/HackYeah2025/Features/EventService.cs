using HackYeah2025.Infrastructure;
using HackYeah2025.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace HackYeah2025.Features;

public interface IEventService
{
    Task<Event?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<List<Event>> GetByOrganizerIdAsync(Guid organizationId, CancellationToken cancellationToken = default);
}

public class EventService : IEventService
{
    private readonly HackYeahDbContext _dbContext;

    public EventService(HackYeahDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<Event?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return _dbContext.Events
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
            .ToListAsync();
    }
}
