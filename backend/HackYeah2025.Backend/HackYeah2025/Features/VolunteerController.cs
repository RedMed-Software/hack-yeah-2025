using HackYeah2025.Infrastructure.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using static HackYeah2025.Features.VolunteerService;

namespace HackYeah2025.Features;

[Route("api/[controller]")]
[ApiController]
public class VolunteerController : ControllerBase
{
    private readonly IVolunteerService _volunteerService;
    private readonly IEventService _eventService;

    public VolunteerController(IVolunteerService volunteerService, IEventService eventService)
    {
        _volunteerService = volunteerService;
        _eventService = eventService;
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<VolunteerDto>> Get(Guid id, CancellationToken cancellationToken)
    {
        Volunteer? volunteer = await _volunteerService.GetByIdAsync(id, cancellationToken);

        if (volunteer is null)
        {
            return NotFound();
        }

        VolunteerDto volunteerDto = new()
        {
            Id = volunteer.Id,
            FirstName = volunteer.FirstName,
            LastName = volunteer.LastName,
            Description = volunteer.Description,
            Availability = new Dictionary<string, string>(volunteer.Availability),
            PreferredRoles = volunteer.PreferredRoles,
            Languages = new Dictionary<string, string>(volunteer.Languages),
            Transport = volunteer.Transport,
            Skills = new Dictionary<string, string>(volunteer.Skills),
            Email = volunteer.Email,
            Phone = volunteer.Phone,
            Account = volunteer.Account,
            Age = volunteer.Age
        };

        volunteerDto.Events = await _eventService.GetByVolunteerIdAsync(id, cancellationToken);

        return Ok(volunteerDto);
    }

    public class VolunteerDto : Volunteer
    {
        public List<Event> Events { get; set; } = new();
    }
}
