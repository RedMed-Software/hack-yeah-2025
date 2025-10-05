using HackYeah2025.Infrastructure;
using HackYeah2025.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace HackYeah2025.Features
{
    public interface IUserService
    {
        Task<Account> GetByAccountIdAsync(Guid accountId, CancellationToken cancellationToken = default);
    }

    public class UserService : IUserService
    {
        private readonly HackYeahDbContext _dbContext;

        public UserService(HackYeahDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Account> GetByAccountIdAsync(Guid accountId, CancellationToken cancellationToken = default)
        {
            Account? account = await _dbContext.Accounts
                .Include(a => a.Volunteer)
                .Include(a => a.Organizer)
                .ThenInclude(a => a.Organization)
                .Include(a => a.Coordinator)
                .FirstOrDefaultAsync(a => a.Id == accountId, cancellationToken);

            return account;
        }
    }
}
