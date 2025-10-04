using HackYeah2025.Infrastructure.Enums;

namespace HackYeah2025.Infrastructure.Models
{
    public class Volunteer
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public RoleType RoleType { get; set; }
        public List<Skill> Skils { get; set; }
    }   
}
