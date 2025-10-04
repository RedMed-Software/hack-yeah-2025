using HackYeah2025.Infrastructure.Models;
using Microsoft.AspNetCore.Mvc;

namespace HackYeah2025.Features;

[Route("api/[controller]")]
[ApiController]
public class OrganizerController : ControllerBase
{
    private readonly IOrganizerService _organizerService;

    public OrganizerController(IOrganizerService organizerService)
    {
        _organizerService = organizerService;
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Organization>> Get(Guid id, CancellationToken cancellationToken)
    {
        Organization? organization = await _organizerService.GetByIdAsync(id, cancellationToken);

        if (organization is null)
        {
            return NotFound();
        }

        return Ok(organization);
    }
}
