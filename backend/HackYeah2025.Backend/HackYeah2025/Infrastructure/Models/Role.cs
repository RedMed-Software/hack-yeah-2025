using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HackYeah2025.Infrastructure.Models;

public class Role
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public ICollection<AccountRole> AccountRoles { get; set; } = new List<AccountRole>();
}

public class DbRoleEntityTypeConfiguration : IEntityTypeConfiguration<Role>
{
    public static readonly Role Volunteer = new()
    {
        Id = Guid.Parse("4d7a2d92-1d09-4e9e-98ed-9d3dc81f2df6"),
        Name = "Wolontariusz"
    };

    public static readonly Role Coordinator = new()
    {
        Id = Guid.Parse("a9a71dc8-3e5d-4c08-a6d5-7a80cd3607cf"),
        Name = "Koordynator"
    };

    public static readonly Role Organizer = new()
    {
        Id = Guid.Parse("f9bc7305-3fa3-4c79-8e59-2f75cd288846"),
        Name = "Organizator"
    };

    public static readonly Role Administrator = new()
    {
        Id = Guid.Parse("be0cb87d-54b9-4f6c-a2d4-0d174f37d0cd"),
        Name = "Administrator"
    };

    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.ToTable("Roles");
        builder.HasKey(r => r.Id);
        builder.Property(r => r.Name).IsRequired().HasMaxLength(128);
        builder.HasIndex(r => r.Name).IsUnique();

        builder.HasMany(r => r.AccountRoles)
            .WithOne(ar => ar.Role)
            .HasForeignKey(ar => ar.RoleId);

        builder.HasData(Volunteer, Coordinator, Organizer, Administrator);
    }
}
