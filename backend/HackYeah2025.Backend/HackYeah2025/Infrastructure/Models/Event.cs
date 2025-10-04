using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HackYeah2025.Infrastructure.Models
{
    public class Event
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public DateTimeOffset DateFrom { get; set; }
        public DateTimeOffset DateTo { get; set; }
        public Guid OrganizationId { get; set; }



        //public List<EventTask> Tasks { get; set; }
    }

    public class DbEventEntityTypeConfiguration : IEntityTypeConfiguration<Event>
    {
        public void Configure(EntityTypeBuilder<Event> builder)
        {
            builder.HasKey(u => u.Id);
        }
    }
}
