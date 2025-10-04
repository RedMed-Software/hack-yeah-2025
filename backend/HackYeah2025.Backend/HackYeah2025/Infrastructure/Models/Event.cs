using HackYeah2025.Infrastructure.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HackYeah2025.Infrastructure.Models;

public sealed class Event
{
    public required Guid Id { get; set; }
    public required string Name { get; set; }
    public string? ShortDescription { get; set; }
    public string? LongDescription { get; set; }
    public required DateTimeOffset DateFrom { get; set; }
    public DateTimeOffset? DateTo { get; set; }
    public string? Place { get; set; }
    public string? City { get; set; }
    public string? Address { get; set; }
    public required decimal Latitude { get; set; }
    public required decimal Longitude { get; set; }
    public required Guid OrganizerId { get; set; }
    public required DateTimeOffset RegisterDate { get; set; }
    public DateTimeOffset? CompletedDate { get; set; }
    public required EventStatus EventStatus { get; set; }

    public ICollection<EventEventTopic> EventEventTopics { get; set; } = [];
    public ICollection<TaskItem> TaskItems { get; set; } = [];
    public Organizer? Organizer { get; set; }
}

public class DbEventEntityTypeConfiguration : IEntityTypeConfiguration<Event>
{
    public void Configure(EntityTypeBuilder<Event> builder)
    {
        builder.HasKey(u => u.Id);
        builder.Property(e => e.Name).IsRequired().HasMaxLength(256);
        builder.Property(e => e.ShortDescription).IsRequired().HasMaxLength(1024);
        builder.Property(e => e.LongDescription).IsRequired();
        builder.Property(e => e.Place).IsRequired().HasMaxLength(256);
        builder.Property(e => e.City).IsRequired().HasMaxLength(128);
        builder.Property(e => e.Address).IsRequired().HasMaxLength(256);
        builder.Property(e => e.Latitude).HasColumnType("decimal(9,6)");
        builder.Property(e => e.Longitude).HasColumnType("decimal(9,6)");

        builder.HasMany(e => e.EventEventTopics)
            .WithOne(eet => eet.Event)
            .HasForeignKey(eet => eet.EventId);

        builder.HasMany(e => e.TaskItems)
            .WithOne(t => t.Event!)
            .HasForeignKey(t => t.EventId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.Organizer)
            .WithMany(e => e.Events)
            .HasForeignKey(e => e.OrganizerId);

        Guid eventId1 = Guid.Parse("2b4ae59e-7adf-4a95-a410-9ec118984d47");
        Guid eventId2 = Guid.Parse("02e80232-d5dc-48b6-a781-b9cc2c68d2c7");
        Guid eventId3 = Guid.Parse("417d347c-c647-4e3e-8754-baf1a8f27fa7");

        builder.HasData(
            new Event
            {
                Id = eventId1,
                Name = "Civic Lab 2025",
                ShortDescription = "Trzydniowe laboratorium projektowe, w trakcie którego młodzież tworzy rozwiązania dla wyzwań lokalnych.",
                LongDescription = "Civic Lab 2025 to intensywny proces projektowy, w którym zespoły młodzieżowe pracują z mentorami nad realnymi wyzwaniami miast. Uczestnicy przejdą przez etap diagnozy problemu, prototypowania rozwiązań oraz przygotowania prezentacji przed jury złożonym z przedstawicieli samorządów i organizacji społecznych.",
                DateFrom = new DateTimeOffset(new DateTime(2025, 4, 10), TimeSpan.Zero),
                DateTo = new DateTimeOffset(new DateTime(2025, 4, 12), TimeSpan.Zero),
                Place = "Centrum Innowacji Młodych",
                City = "Warszawa",
                Address = "ul. Przemian 4",
                Latitude = 50.067930m,
                Longitude = 19.983189m,
                OrganizerId = Guid.Parse("4b1846cf-3c3a-4939-85f9-884f48216dfb"),
                EventStatus = EventStatus.Register,
                RegisterDate = new DateTimeOffset(new DateTime(2025, 3, 10), TimeSpan.Zero),
            },
            new Event
            {
                Id = eventId2,
                Name = "Civic Lab 2024",
                ShortDescription = "Trzydniowe laboratorium projektowe, w trakcie którego młodzież tworzy rozwiązania dla wyzwań lokalnych.",
                LongDescription = "Civic Lab 2023 to intensywny proces projektowy, w którym zespoły młodzieżowe pracują z mentorami nad realnymi wyzwaniami miast. Uczestnicy przejdą przez etap diagnozy problemu, prototypowania rozwiązań oraz przygotowania prezentacji przed jury złożonym z przedstawicieli samorządów i organizacji społecznych.",
                DateFrom = new DateTimeOffset(new DateTime(2024, 4, 10), TimeSpan.Zero),
                DateTo = new DateTimeOffset(new DateTime(2024, 4, 12), TimeSpan.Zero),
                Place = "Centrum Innowacji Młodych",
                City = "Warszawa",
                Address = "ul. Przemian 4",
                Latitude = 51.067930m,
                Longitude = 20.983189m,
                OrganizerId = Guid.Parse("4b1846cf-3c3a-4939-85f9-884f48216dfb"),
                EventStatus = EventStatus.Register,
                RegisterDate = new DateTimeOffset(new DateTime(2024, 3, 10), TimeSpan.Zero),
            },
            new Event
            {
                Id = eventId3,
                Name = "Civic Lab 2023",
                ShortDescription = "Trzydniowe laboratorium projektowe, w trakcie którego młodzież tworzy rozwiązania dla wyzwań lokalnych.",
                LongDescription = "Civic Lab 2023 to intensywny proces projektowy, w którym zespoły młodzieżowe pracują z mentorami nad realnymi wyzwaniami miast. Uczestnicy przejdą przez etap diagnozy problemu, prototypowania rozwiązań oraz przygotowania prezentacji przed jury złożonym z przedstawicieli samorządów i organizacji społecznych.",
                DateFrom = new DateTimeOffset(new DateTime(2023, 4, 10), TimeSpan.Zero),
                DateTo = new DateTimeOffset(new DateTime(2023, 4, 12), TimeSpan.Zero),
                Place = "Centrum Innowacji Młodych",
                City = "Warszawa",
                Address = "ul. Przemian 4",
                Latitude = 51.067930m,
                Longitude = 18.983189m,
                OrganizerId = Guid.Parse("4b1846cf-3c3a-4939-85f9-884f48216dfb"),
                EventStatus = EventStatus.Register,
                RegisterDate = new DateTimeOffset(new DateTime(2023, 3, 10), TimeSpan.Zero),
            }
        );
    }
}
