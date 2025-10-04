using System.Collections.Generic;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HackYeah2025.Infrastructure.Models;

public class Tag
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    [JsonIgnore]
    public ICollection<VolunteerTag> VolunteerTags { get; set; } = new List<VolunteerTag>();
}

public class VolunteerTag
{
    public Guid VolunteerId { get; set; }
    [JsonIgnore]
    public Volunteer Volunteer { get; set; } = null!;
    public Guid TagId { get; set; }
    public Tag Tag { get; set; } = null!;
}

public class DbTagEntityTypeConfiguration : IEntityTypeConfiguration<Tag>
{
    public void Configure(EntityTypeBuilder<Tag> builder)
    {
        builder.ToTable("Tags");
        builder.HasKey(t => t.Id);
        builder.Property(t => t.Name).IsRequired().HasMaxLength(128);

        builder.HasMany(t => t.VolunteerTags)
            .WithOne(vt => vt.Tag)
            .HasForeignKey(vt => vt.TagId);

        builder.HasData(
            new Tag { Id = Guid.Parse("9a3e0ca5-579f-49ba-a479-76a519e5c08a"), Name = "Integracja młodzieży" },
            new Tag { Id = Guid.Parse("0b93ef04-03ea-4bb8-8aa4-2a0d9c51bfb3"), Name = "Wsparcie seniorów" },
            new Tag { Id = Guid.Parse("1a6d420a-4851-45ce-b756-609d0c48e1c6"), Name = "Wydarzenia kulturalne" },
            new Tag { Id = Guid.Parse("1d8cb68b-20da-4c4c-93f0-326f0f7a086b"), Name = "Edukacja obywatelska" }
        );
    }
}

public class DbVolunteerTagEntityTypeConfiguration : IEntityTypeConfiguration<VolunteerTag>
{
    public void Configure(EntityTypeBuilder<VolunteerTag> builder)
    {
        builder.ToTable("VolunteerTags");
        builder.HasKey(vt => new { vt.VolunteerId, vt.TagId });

        builder.HasOne(vt => vt.Volunteer)
            .WithMany(v => v.VolunteerTags)
            .HasForeignKey(vt => vt.VolunteerId);

        builder.HasOne(vt => vt.Tag)
            .WithMany(t => t.VolunteerTags)
            .HasForeignKey(vt => vt.TagId);

        builder.HasData(
            new VolunteerTag { VolunteerId = Guid.Parse("9f064bb8-162d-4e49-88f5-2e5f5f9a7ab8"), TagId = Guid.Parse("9a3e0ca5-579f-49ba-a479-76a519e5c08a") },
            new VolunteerTag { VolunteerId = Guid.Parse("9f064bb8-162d-4e49-88f5-2e5f5f9a7ab8"), TagId = Guid.Parse("0b93ef04-03ea-4bb8-8aa4-2a0d9c51bfb3") },
            new VolunteerTag { VolunteerId = Guid.Parse("9f064bb8-162d-4e49-88f5-2e5f5f9a7ab8"), TagId = Guid.Parse("1a6d420a-4851-45ce-b756-609d0c48e1c6") },
            new VolunteerTag { VolunteerId = Guid.Parse("9f064bb8-162d-4e49-88f5-2e5f5f9a7ab8"), TagId = Guid.Parse("1d8cb68b-20da-4c4c-93f0-326f0f7a086b") }
        );
    }
}
