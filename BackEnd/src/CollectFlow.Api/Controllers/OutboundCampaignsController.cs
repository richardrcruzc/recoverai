using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/outbound/campaigns")]
[Authorize]
public class OutboundCampaignsController : ControllerBase
{
    private readonly IOutboundEmailService _outboundEmailService;

    public OutboundCampaignsController(IOutboundEmailService outboundEmailService)
    {
        _outboundEmailService = outboundEmailService;
    }

    [HttpPost("{campaignId:guid}/send")]
    public async Task<IActionResult> Send(Guid campaignId, [FromQuery] int limit = 25)
    {
        var sent = await _outboundEmailService.SendCampaignAsync(campaignId, limit);
        return Ok(new { sent });
    }
}