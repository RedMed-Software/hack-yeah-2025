using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HackYeah2025.Infrastructure.Models;

public sealed class TaskItem
{
    public Guid Id { get; set; }
    public Guid EventId { get; set; }
    public string Title { get; set; } = default!;
    public DateTimeOffset DateStart { get; set; }
    public DateTimeOffset? DateEnd { get; set; }

    public Event? Event { get; set; }
    public ICollection<AccountTask> AccountTasks { get; set; } = [];
}

public sealed class DbTaskItemEntityTypeConfiguration : IEntityTypeConfiguration<TaskItem>
{
    public void Configure(EntityTypeBuilder<TaskItem> builder)
    {
        builder.HasKey(t => t.Id);

        builder.Property(t => t.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(t => t.DateStart)
            .IsRequired();

        builder.Property(t => t.DateEnd);

        builder.HasOne(t => t.Event)
               .WithMany(e => e.TaskItems)
               .HasForeignKey(t => t.EventId)
               .IsRequired()
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(t => t.AccountTasks)
            .WithOne(at => at.Task)
            .HasForeignKey(at => at.TaskItemId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);
    }
}
