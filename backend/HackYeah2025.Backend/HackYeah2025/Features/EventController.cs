using HackYeah2025.Features.Services;
using HackYeah2025.Infrastructure.Models;
using Microsoft.AspNetCore.Mvc;

namespace HackYeah2025.Features
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventController : ControllerBase
    {
        private readonly IEventService _eventService;

        public EventController(IEventService eventService)
        {
            _eventService = eventService;
        }

        [HttpPost("search")]
        public async Task<ActionResult<List<Event>>> Search()
        {





            return Ok(new());
        }

        [HttpPost("")]
        public async Task<ActionResult> CreateEvent([FromBody] Event @event)
        {
            await _eventService.CreateEvent(@event);

            return Ok();
        }

        [HttpGet("{eventId}")]
        public async Task<ActionResult<Event>> GetById(Guid eventId)
        {
            Event @event = await _eventService.GetByIdAsync(eventId);

            return Ok(@event);
        }

        [HttpGet("get-by-organization-id/{organizationId}")]
        public async Task<ActionResult<List<Event>>> GetByOrganizationId(Guid organizationId)
        {
            List<Event> events = await _eventService.GetByOrganizationIdAsync(organizationId);
            return Ok(events);
        }

    }
}
