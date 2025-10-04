using HackYeah2025.Infrastructure;
using HackYeah2025.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace HackYeah2025.Features;

public interface IOrganizationService
{
    Task<Organization?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
}

public class OrganizationService : IOrganizationService
{
    private readonly HackYeahDbContext _dbContext;

    public OrganizationService(HackYeahDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<Organization?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return _dbContext.Organizations
            .AsNoTracking()
            .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);
    }
}
