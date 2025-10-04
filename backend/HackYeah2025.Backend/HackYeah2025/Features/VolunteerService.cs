using HackYeah2025.Infrastructure;
using HackYeah2025.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace HackYeah2025.Features;

public interface IVolunteerService
{
    Task<Volunteer?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
}

public class VolunteerService : IVolunteerService
{
    private readonly HackYeahDbContext _dbContext;

    public VolunteerService(HackYeahDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<Volunteer?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return _dbContext.Volunteers
            .Include(v => v.VolunteerTags)
                .ThenInclude(vt => vt.Tag)
            .Include(v => v.Distinctions)
            .AsNoTracking()
            .FirstOrDefaultAsync(v => v.Id == id, cancellationToken);
    }
}
