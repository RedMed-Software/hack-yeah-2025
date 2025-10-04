using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HackYeah2025.Infrastructure.Models;

public class Coordinator
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Account? Account { get; set; }
}

public class DbCoordinatorEntityTypeConfiguration : IEntityTypeConfiguration<Coordinator>
{
    public void Configure(EntityTypeBuilder<Coordinator> builder)
    {
        builder.ToTable("Coordinators");
        builder.HasKey(c => c.Id);
        builder.Property(c => c.FirstName).IsRequired().HasMaxLength(128);
        builder.Property(c => c.LastName).IsRequired().HasMaxLength(128);
        builder.Property(c => c.Description).IsRequired().HasMaxLength(1024);

        builder.HasOne(c => c.Account)
            .WithOne(a => a.Coordinator)
            .HasForeignKey<Account>(a => a.CoordinatorId);
    }
}
