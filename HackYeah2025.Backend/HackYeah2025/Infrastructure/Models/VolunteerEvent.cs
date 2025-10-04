namespace HackYeah2025.Infrastructure.Models;

public class VolunteerEvent
{
    public string Name { get; set; }
    public string Description { get; set; }
    public string Localization { get; set; }
    public DateTimeOffset DateFrom { get; set; } 
    public DateTimeOffset DateTo { get; set; }

    public Guid OrganizationId { get; set; }
    public List<Requirement> Requirements { get; set; }
}
