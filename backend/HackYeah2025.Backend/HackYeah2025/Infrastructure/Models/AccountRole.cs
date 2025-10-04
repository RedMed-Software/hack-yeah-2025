using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HackYeah2025.Infrastructure.Models;

public class AccountRole
{
    public Guid AccountId { get; set; }
    public Account Account { get; set; } = null!;
    public Guid RoleId { get; set; }
    public Role Role { get; set; } = null!;
}

public class DbAccountRoleEntityTypeConfiguration : IEntityTypeConfiguration<AccountRole>
{
    public void Configure(EntityTypeBuilder<AccountRole> builder)
    {
        builder.ToTable("AccountRoles");
        builder.HasKey(ar => new { ar.AccountId, ar.RoleId });
    }
}
