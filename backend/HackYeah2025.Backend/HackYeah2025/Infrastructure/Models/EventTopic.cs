using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HackYeah2025.Infrastructure.Models;

public class EventTopic
{
    public required Guid Id { get; set; }
    public required string Name { get; set; }
    public ICollection<EventEventTopic> EventEventTopics { get; set; } = [];
}

public class EventEventTopic
{
    public required Guid EventId { get; set; }
    public required Guid EventTopicId { get; set; }
    public Event? Event { get; set; }
    public EventTopic? EventTopic { get; set; }
}

public class DbEventTopicEntityTypeConfiguration : IEntityTypeConfiguration<EventTopic>
{
    public void Configure(EntityTypeBuilder<EventTopic> builder)
    {
        builder.ToTable("EventTopics");
        builder.HasKey(et => et.Id);
        builder.Property(et => et.Name).IsRequired().HasMaxLength(128);

        builder.HasMany(et => et.EventEventTopics)
            .WithOne(eet => eet.EventTopic)
            .HasForeignKey(eet => eet.EventTopicId);

        builder.HasData(
            new EventTopic
            {
                Id = Guid.Parse("3acb29ab-38b3-4ce3-89ad-2fd25ed4a51c"),
                Name = "innowacje społeczne"
            },
            new EventTopic
            {
                Id = Guid.Parse("d46920c0-0b77-4a0e-8c1f-9af70906cb60"),
                Name = "edukacja obywatelska"
            }
        );
    }
}

public class DbEventEventTopicEntityTypeConfiguration : IEntityTypeConfiguration<EventEventTopic>
{
    public void Configure(EntityTypeBuilder<EventEventTopic> builder)
    {
        builder.ToTable("EventEventTopics");
        builder.HasKey(eet => new { eet.EventId, eet.EventTopicId });

        builder.HasOne(eet => eet.Event)
            .WithMany(e => e.EventEventTopics)
            .HasForeignKey(eet => eet.EventId);

        builder.HasOne(eet => eet.EventTopic)
            .WithMany(et => et.EventEventTopics)
            .HasForeignKey(eet => eet.EventTopicId);

        builder.HasData(
            new EventEventTopic
            {
                EventId = Guid.Parse("2b4ae59e-7adf-4a95-a410-9ec118984d47"),
                EventTopicId = Guid.Parse("3acb29ab-38b3-4ce3-89ad-2fd25ed4a51c")
            },
            new EventEventTopic
            {
                EventId = Guid.Parse("2b4ae59e-7adf-4a95-a410-9ec118984d47"),
                EventTopicId = Guid.Parse("d46920c0-0b77-4a0e-8c1f-9af70906cb60")
            }
        );
    }
}
