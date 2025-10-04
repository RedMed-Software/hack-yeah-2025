using HackYeah2025.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace HackYeah2025.Infrastructure;

public sealed class HackYeahDbContext : DbContext
{
    public DbSet<Event> Events { get; set; }

    public HackYeahDbContext(DbContextOptions<HackYeahDbContext> options) : base(options) 
    { 
    
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.ApplyConfiguration(new DbEventEntityTypeConfiguration());
    }
}
