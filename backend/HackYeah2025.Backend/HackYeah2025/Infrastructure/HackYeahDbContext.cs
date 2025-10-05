using HackYeah2025.Infrastructure.Models;
using HackYeah2025.Infrastructure.Security;
using Microsoft.EntityFrameworkCore;

namespace HackYeah2025.Infrastructure;

public sealed class HackYeahDbContext : DbContext
{
    public DbSet<Event> Events { get; set; }
    public DbSet<Organization> Organizations { get; set; }
    public DbSet<Organizer> Organizers { get; set; }
    public DbSet<Coordinator> Coordinators { get; set; }
    public DbSet<Volunteer> Volunteers { get; set; }
    public DbSet<Tag> Tags { get; set; }
    public DbSet<VolunteerTag> VolunteerTags { get; set; }
    public DbSet<VolunteerDistinction> VolunteerDistinctions { get; set; }
    public DbSet<Account> Accounts { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<AccountRole> AccountRoles { get; set; }
    public DbSet<EventTopic> EventTopics { get; set; }
    public DbSet<EventEventTopic> EventEventTopics { get; set; }
    public DbSet<TaskItem> TaskItems { get; set; }
    public DbSet<AccountTask> AccountTasks { get; set; }
    public DbSet<EventsAccount> EventsAccounts { get; set; }

    public HackYeahDbContext(DbContextOptions<HackYeahDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfiguration(new DbEventEntityTypeConfiguration());
        modelBuilder.ApplyConfiguration(new DbOrganizationEntityTypeConfiguration());
        modelBuilder.ApplyConfiguration(new DbOrganizerEntityTypeConfiguration());
        modelBuilder.ApplyConfiguration(new DbCoordinatorEntityTypeConfiguration());
        modelBuilder.ApplyConfiguration(new DbVolunteerEntityTypeConfiguration());
        modelBuilder.ApplyConfiguration(new DbTagEntityTypeConfiguration());
        modelBuilder.ApplyConfiguration(new DbVolunteerTagEntityTypeConfiguration());
        modelBuilder.ApplyConfiguration(new DbVolunteerDistinctionEntityTypeConfiguration());
        modelBuilder.ApplyConfiguration(new DbAccountEntityTypeConfiguration());
        modelBuilder.ApplyConfiguration(new DbRoleEntityTypeConfiguration());
        modelBuilder.ApplyConfiguration(new DbAccountRoleEntityTypeConfiguration());
        modelBuilder.ApplyConfiguration(new DbEventTopicEntityTypeConfiguration());
        modelBuilder.ApplyConfiguration(new DbEventEventTopicEntityTypeConfiguration());
        modelBuilder.ApplyConfiguration(new DbTaskItemEntityTypeConfiguration());
        modelBuilder.ApplyConfiguration(new DbAccountTaskEntityTypeConfiguration()); 
        modelBuilder.ApplyConfiguration(new DbEventsAccountEntityTypeConfiguration());

        // przyk³adowe ID
        Guid volunteerId = Guid.Parse("9E9A45BC-06B1-4827-BF30-3341A74B2441");
        Guid organizerId = Guid.Parse("31B0D40D-7F7B-46A4-AEEA-39300334645C");
        Guid coordinatorId = Guid.Parse("03567278-63F7-4918-B856-2E01B13DEF50");

        Guid volunteerAccountId = Guid.Parse("F494B5FC-9CE3-4C1A-A46D-1416CE945A49");
        Guid organizerAccountId = Guid.Parse("DB2ACD9B-B75D-4D8F-BBD4-A02BE967B5D1");
        Guid coordinatorAccountId = Guid.Parse("B70BE7B4-44F0-4415-A256-BE158573D499");
        Guid orgId = Guid.Parse("B70BE7B4-44F0-4415-A256-BE158573D499");

        modelBuilder.Entity<Organization>().HasData(
            new Organization
            {
                Id = orgId,
                Name = "Fundacja Dobrych Wydarzeñ",
                FoundedYear = 2015,
                Location = "Warszawa, Polska",
                Programs = "Pomoc spo³eczna, organizacja wydarzeñ charytatywnych",
                Mission = "Wspieranie spo³ecznoœci lokalnych przez organizacjê eventów dobroczynnych",
                Website = "https://fundacjadobrychwydarzen.pl"
            }
        );

        modelBuilder.Entity<Volunteer>().HasData(new Volunteer
        {
            Id = volunteerId,
            FirstName = "Jan",
            LastName = "Nowak",
            Description = "Pomaga przy eventach sportowych",
            PreferredRoles = "Obs³uga goœci",
            Transport = "Auto",
            Email = "jan.nowak@example.com",
            Phone = "+48123456789",
            Age = 18,
            Availability = new Dictionary<string, string>(),
            Languages = new Dictionary<string, string>(),
            Skills = new Dictionary<string, string>()
        });

        // Organizer
        modelBuilder.Entity<Organizer>().HasData(new Organizer
        {
            Id = organizerId,
            OrganizationId = orgId,
            FullName = "Anna Kowalska",
            Role = "Event Manager",
            Phone = "+48987654321",
            Email = "anna.kowalska@example.com",
            Languages = "PL, EN",
            Specializations = "Organizacja eventów"
        });

        // Coordinator
        modelBuilder.Entity<Coordinator>().HasData(new Coordinator
        {
            Id = coordinatorId,
            FirstName = "Piotr",
            LastName = "Wiœniewski",
            Description = "Koordynator wolontariuszy"
        });

        // Accounts
        modelBuilder.Entity<Account>().HasData(
            new Account
            {
                Id = volunteerAccountId,
                Login = "volunteer",
                Email = "volunteer@example.com",
                PasswordHash = PasswordHasher.Hash("test1234"),
                VolunteerId = volunteerId
            },
            new Account
            {
                Id = organizerAccountId,
                Login = "organizer",
                Email = "organizer@example.com",
                PasswordHash = PasswordHasher.Hash("test1234"),
                OrganizerId = organizerId
            },
            new Account
            {
                Id = coordinatorAccountId,
                Login = "coordinator",
                Email = "coordinator@example.com",
                PasswordHash = PasswordHasher.Hash("test1234"),
                CoordinatorId = coordinatorId
            }
        );
    }
}
