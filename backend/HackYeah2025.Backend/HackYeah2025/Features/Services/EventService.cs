using HackYeah2025.Infrastructure;
using HackYeah2025.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading;

namespace HackYeah2025.Features.Services
{
    public interface IEventService
    {
        public Task<Event> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        public Task<List<Event>> GetByOrganizationIdAsync(Guid organizationId, CancellationToken cancellationToken = default);
        public Task<List<Event>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
        public Task<List<Event>> SearchAsync(EventSearch eventSearch);
        public Task CreateEventAsync(Event @event);
    }

    public class EventService : IEventService
    {
        private readonly HackYeahDbContext _dbContext;

        public EventService(HackYeahDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Event> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _dbContext.Events
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
        }
        public async  Task<List<Event>> GetByOrganizationIdAsync(Guid organizationId, CancellationToken cancellationToken = default)
        {
            return await _dbContext.Events
                .Where(e => e.OrganizationId == organizationId)
                .ToListAsync();
        }

        public async Task CreateEventAsync(Event @event)
        {
            await _dbContext.Events.AddAsync(@event);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<List<Event>> SearchAsync(EventSearch eventSearch)
        {
            return await _dbContext.Events
                                ///todo
                 .AsNoTracking()
                .ToListAsync();
        }

        public Task<List<Event>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }
    }
}
