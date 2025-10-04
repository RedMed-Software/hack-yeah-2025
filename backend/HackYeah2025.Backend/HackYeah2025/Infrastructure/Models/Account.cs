using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HackYeah2025.Infrastructure.Models;

public class Account
{
    public Guid Id { get; set; }
    public string Login { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public Guid? VolunteerId { get; set; }
    public Volunteer? Volunteer { get; set; }
    public Guid? OrganizerId { get; set; }
    public Organizer? Organizer { get; set; }
    public Guid? CoordinatorId { get; set; }
    public Coordinator? Coordinator { get; set; }

    public ICollection<AccountRole> AccountRoles { get; set; } = [];
    public ICollection<AccountTask> AccountTasks { get; set; } = [];
}

public class DbAccountEntityTypeConfiguration : IEntityTypeConfiguration<Account>
{
    public void Configure(EntityTypeBuilder<Account> builder)
    {
        builder.ToTable("Accounts");
        builder.HasKey(a => a.Id);
        builder.Property(a => a.Login).IsRequired().HasMaxLength(128);
        builder.Property(a => a.Email).IsRequired().HasMaxLength(256);
        builder.Property(a => a.PasswordHash).IsRequired().HasMaxLength(512);
        builder.Property(a => a.IsActive).IsRequired();
        builder.Property(a => a.CreatedAt)
            .HasColumnType("timestamp without time zone")
            .HasDefaultValueSql("timezone('utc', now())");

        builder.HasIndex(a => a.Login).IsUnique();
        builder.HasIndex(a => a.Email).IsUnique();

        builder.HasMany(a => a.AccountRoles)
            .WithOne(ar => ar.Account)
            .HasForeignKey(ar => ar.AccountId);

        builder.HasOne(a => a.Volunteer)
            .WithOne(v => v.Account)
            .HasForeignKey<Account>(a => a.VolunteerId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(a => a.Organizer)
            .WithOne(o => o.Account)
            .HasForeignKey<Account>(a => a.OrganizerId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(a => a.Coordinator)
            .WithOne(c => c.Account)
            .HasForeignKey<Account>(a => a.CoordinatorId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(a => a.AccountTasks)
            .WithOne(at => at.Account)
            .HasForeignKey(at => at.AccountId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
