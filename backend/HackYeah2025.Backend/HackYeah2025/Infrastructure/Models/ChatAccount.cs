using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HackYeah2025.Infrastructure.Models;

public class ChatAccount
{
    public Guid ChatId { get; set; }
    public Chat Chat { get; set; } = null!;
    public Guid AccountId { get; set; }
    public Account Account { get; set; } = null!;
}

public class DbChatAccountEntityTypeConfiguration : IEntityTypeConfiguration<ChatAccount>
{
    public void Configure(EntityTypeBuilder<ChatAccount> builder)
    {
        builder.ToTable("ChatAccounts");
        builder.HasKey(ca => new { ca.ChatId, ca.AccountId });
        builder.HasOne(ca => ca.Chat)
            .WithMany(c => c.ChatAccounts)
            .HasForeignKey(ca => ca.ChatId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(ca => ca.Account)
            .WithMany(a => a.ChatAccounts)
            .HasForeignKey(ca => ca.AccountId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
