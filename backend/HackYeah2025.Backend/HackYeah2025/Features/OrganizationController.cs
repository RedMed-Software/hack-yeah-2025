using HackYeah2025.Infrastructure.Models;
using Microsoft.AspNetCore.Mvc;

namespace HackYeah2025.Features;

[Route("api/[controller]")]
[ApiController]
public class OrganizationController : ControllerBase
{
    private readonly IOrganizationService _organizationService;

    public OrganizationController(IOrganizationService organizationService)
    {
        _organizationService = organizationService;
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Organization>> Get(Guid id, CancellationToken cancellationToken)
    {
        Organization? organization = await _organizationService.GetByIdAsync(id, cancellationToken);

        if (organization is null)
        {
            return NotFound();
        }

        return Ok(organization);
    }
}
