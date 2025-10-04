using HackYeah2025.Infrastructure;
using HackYeah2025.Infrastructure.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HackYeah2025.Features;

[ApiController]
[Route("api/tasks")]
public sealed class TaskController(HackYeahDbContext dbContext) : ControllerBase
{
    [HttpPost("event/{eventId:guid}")]
    public async Task<IActionResult> AddTaskToEvent(Guid eventId, [FromBody] TaskItemDto dto)
    {
        Event? ev = await dbContext.Events.FindAsync(eventId);
        if (ev == null)
        {
            return NotFound(new { message = "Event nie istnieje." });
        }

        TaskItem task = new()
        {
            Id = Guid.NewGuid(),
            EventId = eventId,
            Title = dto.Title,
            DateStart = dto.DateStart,
            DateEnd = dto.DateEnd
        };

        dbContext.TaskItems.Add(task);
        await dbContext.SaveChangesAsync();

        return Ok(task);
    }

    [HttpPost("{taskId:guid}/assign/{accountId:guid}")]
    public async Task<IActionResult> AssignAccountToTask(Guid taskId, Guid accountId)
    {
        TaskItem? task = await dbContext.TaskItems.FindAsync(taskId);
        if (task == null)
        {
            return NotFound(new { message = "Task nie istnieje." });
        }

        Account? account = await dbContext.Accounts.FindAsync(accountId);
        if (account == null)
        {
            return NotFound(new { message = "Account nie istnieje." });
        }

        if (await dbContext.AccountTasks.AnyAsync(at => at.TaskItemId == taskId && at.AccountId == accountId))
        {
            return BadRequest(new { message = "Account już przypisany do tego taska." });
        }

        AccountTask accountTask = new()
        {
            AccountId = accountId,
            TaskItemId = taskId
        };

        dbContext.AccountTasks.Add(accountTask);
        await dbContext.SaveChangesAsync();

        return Ok(accountTask);
    }

    [HttpGet("event/{eventId:guid}")]
    public async Task<IActionResult> GetTasksForEvent(Guid eventId)
    {
        List<TaskItem> tasks = await dbContext.TaskItems
            .Where(t => t.EventId == eventId)
            .Include(t => t.AccountTasks)
            .ThenInclude(at => at.Account)
            .ToListAsync();

        return Ok(tasks);
    }
}

public sealed record TaskItemDto
{
    public required string Title { get; init; }
    public required DateTimeOffset DateStart { get; init; }
    public DateTimeOffset? DateEnd { get; init; }
}
