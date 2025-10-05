using System.Security.Claims;
using HackYeah2025.Infrastructure;
using HackYeah2025.Infrastructure.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HackYeah2025.Features;

[ApiController]
[Route("api/[controller]")]
public sealed class ChatController(HackYeahDbContext dbContext) : ControllerBase
{
    [HttpPost("start/account/{accountId:guid}")]
    public async Task<ActionResult<Guid>> StartChatWithAccount(Guid accountId, CancellationToken cancellationToken = default)
    {
        string? currentAccountIdString = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("No account id in claims");
        Guid currentAccountId = Guid.Parse(currentAccountIdString);

        var chat = await dbContext.Chats
            .Include(c => c.ChatAccounts)
            .Where(c => c.EventId == null)
            .Where(c => c.ChatAccounts.Any(ca => ca.AccountId == currentAccountId) &&
                        c.ChatAccounts.Any(ca => ca.AccountId == accountId))
            .FirstOrDefaultAsync(cancellationToken);

        if (chat != null)
            return Ok(chat.ChatId);

        // Najpierw utwórz czat
        var newChat = new Chat
        {
            ChatId = Guid.NewGuid(),
            EventId = null
        };
        dbContext.Chats.Add(newChat);
        await dbContext.SaveChangesAsync(cancellationToken);

        // Następnie utwórz powiązania ChatAccount
        var chatAccounts = new List<ChatAccount>
        {
            new() { ChatId = newChat.ChatId, AccountId = currentAccountId },
            new() { ChatId = newChat.ChatId, AccountId = accountId }
        };
        dbContext.ChatAccounts.AddRange(chatAccounts);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(newChat.ChatId);
    }

    [HttpPost("start/event/{eventId:guid}")]
    public async Task<ActionResult<Guid>> StartChatWithEvent(Guid eventId, CancellationToken cancellationToken = default)
    {
        string? currentAccountIdString = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("No account id in claims");
        Guid currentAccountId = Guid.Parse(currentAccountIdString);

        var chat = await dbContext.Chats
            .Include(c => c.ChatAccounts)
            .FirstOrDefaultAsync(c => c.EventId == eventId, cancellationToken);

        if (chat == null)
        {
            chat = new Chat
            {
                ChatId = Guid.NewGuid(),
                EventId = eventId
            };
            dbContext.Chats.Add(chat);
            await dbContext.SaveChangesAsync(cancellationToken);

            var chatAccount = new ChatAccount { ChatId = chat.ChatId, AccountId = currentAccountId };
            dbContext.ChatAccounts.Add(chatAccount);
            await dbContext.SaveChangesAsync(cancellationToken);

            return Ok(chat.ChatId);
        }

        bool exists = chat.ChatAccounts.Any(ca => ca.AccountId == currentAccountId);
        if (!exists)
        {
            var chatAccount = new ChatAccount { ChatId = chat.ChatId, AccountId = currentAccountId };
            dbContext.ChatAccounts.Add(chatAccount);
            await dbContext.SaveChangesAsync(cancellationToken);
        }
        return Ok(chat.ChatId);
    }

    [HttpGet("{chatId:guid}/messages")]
    public async Task<ActionResult<List<ChatMessageDto>>> GetChatMessages(Guid chatId, CancellationToken cancellationToken = default)
    {
        var messages = await dbContext.ChatMessages
            .Where(m => m.ChatId == chatId)
            .OrderBy(m => m.Timestamp)
            .Select(m => new ChatMessageDto
            {
                ChatMessageId = m.ChatMessageId,
                AccountId = m.AccountId,
                Message = m.Message,
                Timestamp = m.Timestamp
            })
            .ToListAsync(cancellationToken);
        return Ok(messages);
    }

    [HttpPost("{chatId:guid}/message")]
    public async Task<ActionResult<Guid>> PostMessage(Guid chatId, [FromBody] CreateChatMessageDto dto, CancellationToken cancellationToken = default)
    {
        string? currentAccountIdString = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("No account id in claims");
        Guid currentAccountId = Guid.Parse(currentAccountIdString);

        var chatExists = await dbContext.Chats.AnyAsync(c => c.ChatId == chatId, cancellationToken);
        if (!chatExists)
            return NotFound("Chat not found");

        var chatMessage = new ChatMessage
        {
            ChatMessageId = Guid.NewGuid(),
            ChatId = chatId,
            AccountId = currentAccountId,
            Message = dto.Message,
            Timestamp = DateTime.UtcNow
        };
        dbContext.ChatMessages.Add(chatMessage);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(chatMessage.ChatMessageId);
    }

    public class ChatMessageDto
    {
        public Guid ChatMessageId { get; set; }
        public Guid AccountId { get; set; }
        public string Message { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
    }

    public class CreateChatMessageDto
    {
        public string Message { get; set; } = string.Empty;
    }
}
