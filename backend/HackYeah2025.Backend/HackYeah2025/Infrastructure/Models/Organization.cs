using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HackYeah2025.Infrastructure.Models;

public class Organization
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public int FoundedYear { get; set; }
    public string Location { get; set; }
    public string Programs { get; set; }
    public string Mission { get; set; }
    public string Website { get; set; }
    public ICollection<Organizer> Organizers { get; set; } = new List<Organizer>();
}

public class DbOrganizationEntityTypeConfiguration : IEntityTypeConfiguration<Organization>
{
    public void Configure(EntityTypeBuilder<Organization> builder)
    {
        builder.HasKey(o => o.Id);
        builder.Property(o => o.Name).IsRequired().HasMaxLength(256);
        builder.Property(o => o.FoundedYear).IsRequired();
        builder.Property(o => o.Location).IsRequired().HasMaxLength(512);
        builder.Property(o => o.Programs).IsRequired().HasMaxLength(1024);
        builder.Property(o => o.Mission).IsRequired().HasMaxLength(1024);
        builder.Property(o => o.Website).IsRequired().HasMaxLength(256);
        builder.HasMany(o => o.Organizers)
            .WithOne(o => o.Organization)
            .HasForeignKey(o => o.OrganizationId);

        builder.HasData(
            new Organization
            {
                Id = Guid.Parse("5d1f3c76-7a10-4fb4-a4a1-0d5710a98b72"),
                Name = "Fundacja Młodzi Działają",
                FoundedYear = 2012,
                Location = "Centrum Aktywności Społecznej\nul. Solidarności 27\nWarszawa",
                Programs = "inkubator projektów, mikrogranty sąsiedzkie, akademia wolontariatu",
                Mission = "Wspieramy młodych liderów w rozwijaniu projektów społecznych, łącząc edukację obywatelską z działaniem w terenie.",
                Website = "https://mlodzi-dzialaja.pl"
            }
        );
    }
}
