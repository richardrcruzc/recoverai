using CollectFlow.Application.Interfaces;
using CollectFlow.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("unsubscribe")]
[Route("api/unsubscribe")]
public class UnsubscribeController : ControllerBase
{
    private readonly CollectFlowDbContext _db;
    private readonly IEmailComplianceService _emailComplianceService;
    public UnsubscribeController(CollectFlowDbContext db, IEmailComplianceService emailComplianceService)
    {
        _db = db;
        _emailComplianceService = emailComplianceService;
    }
    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> Unsubscribe(
        [FromBody] UnsubscribeRequest request,
        CancellationToken cancellationToken)
    {
        var success = await _emailComplianceService.UnsubscribeAsync(
            request.Token,
            cancellationToken);

        return success
            ? Ok(new { message = "You have been unsubscribed." })
            : BadRequest(new { message = "Invalid or expired unsubscribe link." });
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
    public class UnsubscribeRequest
    {
        public string Token { get; set; } = string.Empty;
    }
}