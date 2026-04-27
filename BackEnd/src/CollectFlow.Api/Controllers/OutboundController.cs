using CollectFlow.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CollectFlow.Api.Controllers;

[ApiController]
[Route("api/outbound")]
[Authorize]
public class OutboundController : ControllerBase
{
    private readonly IOutboundQueryService _outboundQueryService;

    public OutboundController(IOutboundQueryService outboundQueryService)
    {
        _outboundQueryService = outboundQueryService;
    }

    [HttpGet("contacts")]
    public async Task<IActionResult> GetContacts(CancellationToken cancellationToken)
    {
        var contacts = await _outboundQueryService.GetContactsAsync(cancellationToken);
        return Ok(contacts);
    }

    [HttpGet("sends")]
    public async Task<IActionResult> GetSends(CancellationToken cancellationToken)
    {
        var sends = await _outboundQueryService.GetSendsAsync(cancellationToken);
        return Ok(sends);
    }
}