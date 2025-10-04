using HackYeah2025.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace HackYeah2025.Infrastructure;

public sealed class HackYeahDbContext : DbContext
{
    public DbSet<Event> Events { get; set; }
    public DbSet<Organization> Organizations { get; set; }
    public DbSet<Organizer> Organizers { get; set; }
    public DbSet<Volunteer> Volunteers { get; set; }
    public DbSet<Tag> Tags { get; set; }
    public DbSet<VolunteerTag> VolunteerTags { get; set; }
    public DbSet<VolunteerDistinction> VolunteerDistinctions { get; set; }
    public DbSet<EventTopic> EventTopics { get; set; }
    public DbSet<EventEventTopic> EventEventTopics { get; set; }

    public HackYeahDbContext(DbContextOptions<HackYeahDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfiguration(new DbEventEntityTypeConfiguration());
        modelBuilder.ApplyConfiguration(new DbOrganizationEntityTypeConfiguration());
        modelBuilder.ApplyConfiguration(new DbOrganizerEntityTypeConfiguration());
        modelBuilder.ApplyConfiguration(new DbVolunteerEntityTypeConfiguration());
        modelBuilder.ApplyConfiguration(new DbTagEntityTypeConfiguration());
        modelBuilder.ApplyConfiguration(new DbVolunteerTagEntityTypeConfiguration());
        modelBuilder.ApplyConfiguration(new DbVolunteerDistinctionEntityTypeConfiguration());
        modelBuilder.ApplyConfiguration(new DbEventTopicEntityTypeConfiguration());
        modelBuilder.ApplyConfiguration(new DbEventEventTopicEntityTypeConfiguration());
    }
}
