using CollectFlow.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("unsubscribe")]
public class UnsubscribeController : ControllerBase
{
    private readonly CollectFlowDbContext _db;

    public UnsubscribeController(CollectFlowDbContext db)
    {
        _db = db;
    }

    [HttpGet("{contactId:guid}")]
    [HttpPost("{contactId:guid}")]
    public async Task<IActionResult> Unsubscribe(Guid contactId)
    {
        var contact = await _db.OutboundContacts.FindAsync(contactId);

        if (contact is not null)
        {
            contact.IsUnsubscribed = true;
            contact.Status = "Unsubscribed";
            await _db.SaveChangesAsync();
        }

        return Content("You have been unsubscribed from CollectFlowAI outreach emails.");
    }
}