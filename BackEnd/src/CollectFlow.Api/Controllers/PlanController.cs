using CollectFlow.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CollectFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PlanController : ControllerBase
{
    private readonly IPlanLimitService _planLimitService;

    public PlanController(IPlanLimitService planLimitService)
    {
        _planLimitService = planLimitService;
    }

    [HttpGet("limits")]
    public async Task<IActionResult> GetLimits(CancellationToken cancellationToken)
    {
        var result = await _planLimitService.GetCurrentLimitsAsync(cancellationToken);
        return Ok(result);
    }
}