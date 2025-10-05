using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HackYeah2025.Infrastructure.Models;

public class Chat
{
    public Guid ChatId { get; set; }
    public Guid? EventId { get; set; }
    public Event? Event { get; set; }
    public ICollection<ChatAccount> ChatAccounts { get; set; } = new List<ChatAccount>();
    public ICollection<ChatMessage> ChatMessages { get; set; } = new List<ChatMessage>();
}

public class DbChatEntityTypeConfiguration : IEntityTypeConfiguration<Chat>
{
    public void Configure(EntityTypeBuilder<Chat> builder)
    {
        builder.ToTable("Chats");
        builder.HasKey(c => c.ChatId);
        builder.Property(c => c.ChatId).IsRequired();
        builder.Property(c => c.EventId).IsRequired(false);
        builder.HasOne(c => c.Event)
            .WithMany(e => e.Chats)
            .HasForeignKey(c => c.EventId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);
        builder.HasMany(c => c.ChatAccounts)
            .WithOne(ca => ca.Chat)
            .HasForeignKey(ca => ca.ChatId);
        builder.HasMany(c => c.ChatMessages)
            .WithOne(cm => cm.Chat)
            .HasForeignKey(cm => cm.ChatId);
    }
}
