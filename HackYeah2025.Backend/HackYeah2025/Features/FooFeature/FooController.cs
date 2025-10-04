using HackYeah2025.Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace HackYeah2025.Features.FooFeature;

[ApiController]
[Route("[controller]")]
public class FooController(HackYeahDbContext dbContext) : ControllerBase
{
    [HttpGet("{id:int}")]
    public async Task<ActionResult<FooDto>> Get(int id)
    {
        Infrastructure.Models.Foo? entity = await dbContext.Foos.FindAsync(id);
        if (entity is null) return NotFound();

        FooDto dto = new()
        {
            Id = entity.Id,
            Name = entity.Name,
            CreatedAt = entity.CreatedAt,
            IsActive = entity.IsActive
        };

        return dto;
    }
}
