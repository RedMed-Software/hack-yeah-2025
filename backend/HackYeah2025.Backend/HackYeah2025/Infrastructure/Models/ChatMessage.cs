using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HackYeah2025.Infrastructure.Models;

public class ChatMessage
{
    public Guid ChatMessageId { get; set; }
    public Guid ChatId { get; set; }
    public Chat Chat { get; set; } = null!;
    public Guid AccountId { get; set; }
    public Account Account { get; set; } = null!;
    public string Message { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
}

public class DbChatMessageEntityTypeConfiguration : IEntityTypeConfiguration<ChatMessage>
{
    public void Configure(EntityTypeBuilder<ChatMessage> builder)
    {
        builder.ToTable("ChatMessages");
        builder.HasKey(cm => cm.ChatMessageId);
        builder.Property(cm => cm.Message).IsRequired().HasMaxLength(2048);
        builder.Property(cm => cm.Timestamp).IsRequired();
        builder.HasOne(cm => cm.Chat)
            .WithMany(c => c.ChatMessages)
            .HasForeignKey(cm => cm.ChatId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(cm => cm.Account)
            .WithMany(a => a.ChatMessages)
            .HasForeignKey(cm => cm.AccountId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
