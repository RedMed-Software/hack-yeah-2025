using HackYeah2025.Infrastructure.Enums;

namespace HackYeah2025.Infrastructure.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string Name { get; set; }    
        public RoleType RoleType { get; set; }
    }
}
