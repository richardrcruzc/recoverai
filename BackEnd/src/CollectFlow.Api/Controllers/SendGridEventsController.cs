using CollectFlow.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

[ApiController]
[Route("api/outbound/sendgrid-events")]
public class SendGridEventsController : ControllerBase
{
    private readonly CollectFlowDbContext _db;

    public SendGridEventsController(CollectFlowDbContext db)
    {
        _db = db;
    }

    [HttpPost]
    public async Task<IActionResult> Receive([FromBody] JsonElement events)
    {
        foreach (var item in events.EnumerateArray())
        {
            var sgMessageId = item.TryGetProperty("sg_message_id", out var msg)
                ? msg.GetString() ?? ""
                : "";

            var eventType = item.TryGetProperty("event", out var ev)
                ? ev.GetString() ?? ""
                : "";

            var url = item.TryGetProperty("url", out var urlProp)
                ? urlProp.GetString() ?? ""
                : "";

            var send = await _db.OutboundEmailSends
                .FirstOrDefaultAsync(x => sgMessageId.Contains(x.ProviderMessageId));

            _db.OutboundEmailEvents.Add(new OutboundEmailEvent
            {
                EmailSendId = send?.Id,
                ProviderMessageId = sgMessageId,
                EventType = eventType,
                Url = url,
                RawJson = item.GetRawText(),
                EventAtUtc = DateTime.UtcNow
            });

            if (send is not null)
            {
                send.LastEvent = eventType;

                if (eventType == "delivered") send.DeliveredAtUtc = DateTime.UtcNow;
                if (eventType == "open") send.OpenedAtUtc = DateTime.UtcNow;
                if (eventType == "click") send.ClickedAtUtc = DateTime.UtcNow;
                if (eventType is "bounce" or "dropped" or "spamreport")
                {
                    send.BouncedAtUtc = DateTime.UtcNow;
                    send.Status = eventType;
                }

                if (eventType is "unsubscribe" or "group_unsubscribe")
                {
                    var contact = await _db.OutboundContacts.FindAsync(send.ContactId);
                    if (contact is not null)
                    {
                        contact.IsUnsubscribed = true;
                        contact.Status = "Unsubscribed";
                    }
                }
            }
        }

        await _db.SaveChangesAsync();
        return Ok();
    }
}