using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Text.Json.Serialization;

namespace HackYeah2025.Infrastructure.Models;

public class VolunteerDistinction
{
    public Guid Id { get; set; }
    public Guid VolunteerId { get; set; }
    [JsonIgnore]
    public Volunteer Volunteer { get; set; } = null!;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class DbVolunteerDistinctionEntityTypeConfiguration : IEntityTypeConfiguration<VolunteerDistinction>
{
    public void Configure(EntityTypeBuilder<VolunteerDistinction> builder)
    {
        builder.ToTable("VolunteerDistinctions");
        builder.HasKey(d => d.Id);
        builder.Property(d => d.Title).IsRequired().HasMaxLength(256);
        builder.Property(d => d.Description).IsRequired().HasMaxLength(1024);

        builder.HasOne(d => d.Volunteer)
            .WithMany(v => v.Distinctions)
            .HasForeignKey(d => d.VolunteerId);

        builder.HasData(
            new VolunteerDistinction
            {
                Id = Guid.Parse("8d5fdf09-04ac-4b76-bbef-f5fb3787e6bf"),
                VolunteerId = Guid.Parse("9f064bb8-162d-4e49-88f5-2e5f5f9a7ab8"),
                Title = "Nagroda \"Wolontariusz roku\"",
                Description = "Wyróżnienie za 120 godzin pracy z młodzieżą i seniorami w 2024 roku."
            },
            new VolunteerDistinction
            {
                Id = Guid.Parse("9e0c6883-9461-4d6f-b6f2-f2de4f6dd0a4"),
                VolunteerId = Guid.Parse("9f064bb8-162d-4e49-88f5-2e5f5f9a7ab8"),
                Title = "Certyfikat z pierwszej pomocy",
                Description = "Ukończony kurs Polskiego Czerwonego Krzyża, obejmujący scenariusze miejskie."
            }
        );
    }
}
