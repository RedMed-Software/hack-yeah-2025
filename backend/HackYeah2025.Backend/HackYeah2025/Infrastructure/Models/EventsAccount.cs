using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HackYeah2025.Infrastructure.Models;

public sealed class EventsAccount
{
    public Guid EventId { get; set; }
    public Guid AccountId { get; set; }

    public Event? Event { get; set; }
    public Account? Account { get; set; }
}

public sealed class DbEventsAccountEntityTypeConfiguration : IEntityTypeConfiguration<EventsAccount>
{
    public void Configure(EntityTypeBuilder<EventsAccount> builder)
    {
        builder.ToTable("EventsAccounts");

        builder.HasKey(ea => new { ea.EventId, ea.AccountId });

        builder
            .HasOne(ea => ea.Event)
            .WithMany(e => e.EventsAccounts)
            .HasForeignKey(ea => ea.EventId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(ea => ea.Account)
            .WithMany(a => a.EventsAccounts)
            .HasForeignKey(ea => ea.AccountId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}