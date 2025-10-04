using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HackYeah2025.Infrastructure.Models;

public class Organizer
{
    public Guid Id { get; set; }
    public Guid OrganizationId { get; set; }
    public string FullName { get; set; }
    public string Role { get; set; }
    public string Phone { get; set; }
    public string Email { get; set; }
    public string Languages { get; set; }
    public string Specializations { get; set; }
    public Organization Organization { get; set; }
}

public class DbOrganizerEntityTypeConfiguration : IEntityTypeConfiguration<Organizer>
{
    public void Configure(EntityTypeBuilder<Organizer> builder)
    {
        builder.HasKey(o => o.Id);
        builder.Property(o => o.FullName).IsRequired().HasMaxLength(256);
        builder.Property(o => o.Role).IsRequired().HasMaxLength(256);
        builder.Property(o => o.Phone).IsRequired().HasMaxLength(64);
        builder.Property(o => o.Email).IsRequired().HasMaxLength(256);
        builder.Property(o => o.Languages).IsRequired().HasMaxLength(256);
        builder.Property(o => o.Specializations).IsRequired().HasMaxLength(512);
        builder.HasOne(o => o.Organization)
            .WithMany(o => o.Organizers)
            .HasForeignKey(o => o.OrganizationId);

        builder.HasData(
            new Organizer
            {
                Id = Guid.Parse("4b1846cf-3c3a-4939-85f9-884f48216dfb"),
                OrganizationId = Guid.Parse("5d1f3c76-7a10-4fb4-a4a1-0d5710a98b72"),
                FullName = "Marta Zawadzka",
                Role = "Koordynatorka programu",
                Phone = "+48 501 222 198",
                Email = "marta.zawadzka@mlodzi-dzialaja.pl",
                Languages = "polski, angielski",
                Specializations = "partycypacja młodzieży, partnerstwa lokalne"
            }
        );
    }
}
