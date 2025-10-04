using HackYeah2025.Infrastructure.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HackYeah2025.Features
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventController : ControllerBase
    {
        public EventController()
        {
            
        }

        [HttpPost("search")]
        public async Task<ActionResult<List<Event>>> Search()
        {
            return Ok(new());
        }



        [HttpGet("{eventId}")]
        public async Task<ActionResult<Event>> Get(Guid id)
        {

            return Ok(new());

        }

    }
}
