namespace HackYeah2025.Infrastructure.Models
{
    public class EventTask
    {
        public Guid Id { get; set; }
        public Guid EventId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; } 
        public int MinAge { get; set; }
        public int Slots { get; set; }
    }
}
