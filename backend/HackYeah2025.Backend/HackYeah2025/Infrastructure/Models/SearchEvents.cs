namespace HackYeah2025.Infrastructure.Models
{
    public class SearchEvents
    {
        public Guid? OrganizerId { get; set; }
        public string? Query { get; set; } = null;
    }
}
