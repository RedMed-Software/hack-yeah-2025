using HackYeah2025.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace HackYeah2025.Infrastructure;

public sealed class HackYeahDbContext : DbContext
{
    public DbSet<Foo> Foos { get; set; }

    public HackYeahDbContext(DbContextOptions<HackYeahDbContext> options) : base(options) 
    { 
    
    }
}
