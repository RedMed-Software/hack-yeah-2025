using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HackYeah2025.Infrastructure.Models;

public class Event
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string LongDescription { get; set; } = string.Empty;
    public DateTimeOffset DateFrom { get; set; }
    public DateTimeOffset DateTo { get; set; }
    public string Place { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }

    public List<Task> Tasks { get; set; } = new();
    public ICollection<EventEventTopic> EventEventTopics { get; set; } = new List<EventEventTopic>();
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

        Guid eventId = Guid.Parse("2b4ae59e-7adf-4a95-a410-9ec118984d47");

        builder.HasData(
            new Event
            {
                Id = eventId,
                Name = "Civic Lab 2025",
                ShortDescription = "Trzydniowe laboratorium projektowe, w trakcie którego młodzież tworzy rozwiązania dla wyzwań lokalnych.",
                LongDescription = "Civic Lab 2025 to intensywny proces projektowy, w którym zespoły młodzieżowe pracują z mentorami nad realnymi wyzwaniami miast. Uczestnicy przejdą przez etap diagnozy problemu, prototypowania rozwiązań oraz przygotowania prezentacji przed jury złożonym z przedstawicieli samorządów i organizacji społecznych.",
                DateFrom = new DateTimeOffset(new DateTime(2025, 4, 10), TimeSpan.Zero),
                DateTo = new DateTimeOffset(new DateTime(2025, 4, 12), TimeSpan.Zero),
                Place = "Centrum Innowacji Młodych",
                City = "Warszawa",
                Address = "ul. Przemian 4",
                Latitude = 50.067930m,
                Longitude = 19.983189m
            }
        );
    }
}
