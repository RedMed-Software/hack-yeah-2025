using HackYeah2025.Infrastructure.Models;
using Microsoft.AspNetCore.Mvc;

namespace HackYeah2025.Features;

[Route("api/[controller]")]
[ApiController]
public class VolunteerController : ControllerBase
{
    private readonly IVolunteerService _volunteerService;

    public VolunteerController(IVolunteerService volunteerService)
    {
        _volunteerService = volunteerService;
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Volunteer>> Get(Guid id, CancellationToken cancellationToken)
    {
        Volunteer? volunteer = await _volunteerService.GetByIdAsync(id, cancellationToken);

        if (volunteer is null)
        {
            return NotFound();
        }

        return Ok(volunteer);

    }
}
