using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HackYeah2025.Infrastructure.Models;

public class Volunteer
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Dictionary<string, string> Availability { get; set; } = new();
    public string PreferredRoles { get; set; } = string.Empty;
    public Dictionary<string, string> Languages { get; set; } = new();
    public string Transport { get; set; } = string.Empty;
    public Dictionary<string, string> Skills { get; set; } = new();
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    [JsonIgnore]
    public ICollection<VolunteerTag> VolunteerTags { get; set; } = new List<VolunteerTag>();
    public ICollection<VolunteerDistinction> Distinctions { get; set; } = new List<VolunteerDistinction>();
    [JsonIgnore]
    public Account? Account { get; set; }
    [NotMapped]
    public IEnumerable<Tag> Tags => VolunteerTags.Select(vt => vt.Tag);
}

public class DbVolunteerEntityTypeConfiguration : IEntityTypeConfiguration<Volunteer>
{
    private static readonly Guid SeedVolunteerId = Guid.Parse("9f064bb8-162d-4e49-88f5-2e5f5f9a7ab8");

    private static readonly Dictionary<string, string> SeedAvailability = new()
    {
        ["tuesday_thursday"] = "Wtorki i czwartki 16:00 – 20:00",
        ["weekends"] = "Weekendy według ustaleń"
    };

    private static readonly Dictionary<string, string> SeedLanguages = new()
    {
        ["Polski"] = "C2",
        ["Angielski"] = "C1",
        ["Ukraiński"] = "B1"
    };

    private static readonly Dictionary<string, string> SeedSkills = new()
    {
        ["Komunikacja i moderacja"] = "Zaawansowany",
        ["Animacja czasu wolnego"] = "Średniozaawansowany",
        ["Pierwsza pomoc"] = "Podstawowy",
        ["Planowanie wydarzeń"] = "Zaawansowany"
    };

    private static readonly Volunteer SeedVolunteer = new()
    {
        Id = SeedVolunteerId,
        FirstName = "Julia",
        LastName = "Nowak",
        Description = "Doświadczona wolontariuszka wspierająca projekty międzypokoleniowe oraz wydarzenia edukacyjne.",
        Availability = SeedAvailability,
        PreferredRoles = "Koordynacja wolontariuszy, prowadzenie warsztatów, moderacja spotkań",
        Languages = SeedLanguages,
        Transport = "Rower, komunikacja miejska, możliwość dojazdu do 20 km",
        Skills = SeedSkills,
        Email = "julia.nowak@mlodzidzialaja.pl",
        Phone = "+48 511 222 333"
    };

    public void Configure(EntityTypeBuilder<Volunteer> builder)
    {
        builder.ToTable("Volunteers");
        builder.HasKey(v => v.Id);
        builder.Property(v => v.FirstName).IsRequired().HasMaxLength(128);
        builder.Property(v => v.LastName).IsRequired().HasMaxLength(128);
        builder.Property(v => v.Description).IsRequired().HasMaxLength(1024);
        builder.Property(v => v.Availability).IsRequired().HasColumnType("jsonb");
        builder.Property(v => v.PreferredRoles).IsRequired().HasMaxLength(512);
        builder.Property(v => v.Languages).IsRequired().HasColumnType("jsonb");
        builder.Property(v => v.Transport).IsRequired().HasMaxLength(256);
        builder.Property(v => v.Skills).IsRequired().HasColumnType("jsonb");
        builder.Property(v => v.Email).IsRequired().HasMaxLength(256);
        builder.Property(v => v.Phone).IsRequired().HasMaxLength(64);

        builder.HasMany(v => v.VolunteerTags)
            .WithOne(vt => vt.Volunteer)
            .HasForeignKey(vt => vt.VolunteerId);

        builder.HasMany(v => v.Distinctions)
            .WithOne(d => d.Volunteer)
            .HasForeignKey(d => d.VolunteerId);

        builder.HasData(SeedVolunteer);
    }
}
