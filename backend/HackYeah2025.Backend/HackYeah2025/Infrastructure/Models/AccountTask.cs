using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HackYeah2025.Infrastructure.Models;

public sealed class AccountTask
{
    public required Guid AccountId { get; set; }
    public required Guid TaskItemId { get; set; }

    public Account? Account { get; set; }
    public TaskItem? Task { get; set; }
}

public sealed class DbAccountTaskEntityTypeConfiguration : IEntityTypeConfiguration<AccountTask>
{
    public void Configure(EntityTypeBuilder<AccountTask> builder)
    {
        builder.HasKey(ut => new { ut.AccountId, ut.TaskItemId });

        builder.HasOne(ut => ut.Account)
            .WithMany(a => a.AccountTasks)
            .HasForeignKey(ut => ut.AccountId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ut => ut.Task)
            .WithMany(t => t.AccountTasks)
            .HasForeignKey(ut => ut.TaskItemId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}