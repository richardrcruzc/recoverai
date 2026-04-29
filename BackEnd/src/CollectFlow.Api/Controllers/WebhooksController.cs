using CollectFlow.Domain.Enums;
using CollectFlow.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/webhooks/instantly")]
public class InstantlyWebhookController : ControllerBase
{
    private readonly CollectFlowDbContext _db;

    public InstantlyWebhookController(CollectFlowDbContext db)
    {
        _db = db;
    }

    [HttpPost]
    public async Task<IActionResult> Handle([FromBody] InstantlyReplyWebhook payload)
    {
        var email = payload.Email?.ToLower();

        if (string.IsNullOrWhiteSpace(email))
            return Ok();

        var lead = await _db.Leads
            .FirstOrDefaultAsync(x => x.Email.ToLower() == email);

        if (lead != null)
        {
            lead.Stage = "Replied";
            lead.LastRepliedAtUtc = DateTime.UtcNow;

            await _db.SaveChangesAsync();
        }

        return Ok();
    }
}