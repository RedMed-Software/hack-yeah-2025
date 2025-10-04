using HackYeah2025.Infrastructure;
using HackYeah2025.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace HackYeah2025.Features;

public interface IOrganizerService
{
    Task<Organizer?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<Organizer?> GetByAccountIdAsync(Guid accountId, CancellationToken cancellationToken = default);
}

public class OrganizerService : IOrganizerService
{
    private readonly HackYeahDbContext _dbContext;

    public OrganizerService(HackYeahDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<Organizer?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return _dbContext.Organizers
            .Include(o => o.Organization)
            .AsNoTracking()
            .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);
    }

    public Task<Organizer?> GetByAccountIdAsync(Guid accountId, CancellationToken cancellationToken = default)
    {
        return _dbContext.Organizers
            .Include(o => o.Account)
            .Include(o => o.Organization)
            .AsNoTracking()
            .FirstOrDefaultAsync(o => o.Account != null && o.Account.Id == accountId, cancellationToken);
    }
}
