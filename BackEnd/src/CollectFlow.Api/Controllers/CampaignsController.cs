using CollectFlow.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/campaigns")]
[Authorize]
public class CampaignsController : ControllerBase
{
    private readonly IEmailAutomationService _svc;

    public CampaignsController(IEmailAutomationService svc)
    {
        _svc = svc;
    }

    [HttpPost("send-day0")]
    public async Task<IActionResult> SendDay0(CancellationToken ct)
    {
        var count = await _svc.SendLeadCampaignAsync(
            "lead-day-0",
            "Quick audit of your unpaid invoices",
            lead => $@"
<p>Hi {lead.Name},</p>
<p>Most businesses don’t have a collections problem — they have a follow-up problem.</p>
<p>CollectFlowAI shows which invoices to prioritize and how much you can recover.</p>
<p><a href=""https://yourdomain.com/demo"">Try the demo</a></p>",
            ct);

        return Ok(new { sent = count });
    }
}