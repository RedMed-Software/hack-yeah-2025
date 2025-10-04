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
        public async Task<ActionResult<List<Event>>> SearchAsync([FromBody] EventSearch eventSearch)
        {
            List<Event> events = await _eventService.SearchAsync(eventSearch);
            return Ok(new());
        }

        [HttpPost("")]
        public async Task<ActionResult> CreateEventAsync([FromBody] Event @event)
        {
            await _eventService.CreateEventAsync(@event);
            return Ok();
        }

        [HttpGet("{eventId}")]
        public async Task<ActionResult<Event>> GetByIdAsync(Guid eventId)
        {
            Event @event = await _eventService.GetByIdAsync(eventId);
            return Ok(@event);
        }

        [HttpGet("get-by-organization-id/{organizationId}")]
        public async Task<ActionResult<List<Event>>> GetByOrganizationIdAsync(Guid organizationId)
        {
            List<Event> events = await _eventService.GetByOrganizationIdAsync(organizationId);
            return Ok(events);
        }

        [HttpGet("get-by-user-id/{userId}")]
        public async Task<ActionResult<List<Event>>> GetByUserIdAsync(Guid userId)
        {
            List<Event> events = await _eventService.GetByUserIdAsync(userId);
            return Ok(events);
        }

    }
}
