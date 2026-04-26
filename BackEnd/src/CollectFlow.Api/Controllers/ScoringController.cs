using CollectFlow.Application.Common;
using CollectFlow.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CollectFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ScoringController : ControllerBase
{
    private readonly IScoringService _scoringService;

    public ScoringController(IScoringService scoringService)
    {
        _scoringService = scoringService;
    }

    [HttpPost("run")]
    public async Task<IActionResult> Run(CancellationToken cancellationToken)
    {
        try { 
        var result = await _scoringService.RunAsync(cancellationToken);
        return Ok(result);
    }
        catch (PaywallException ex)
        {
            return StatusCode(StatusCodes.Status402PaymentRequired, new
            {
        message = ex.Message,
                feature = ex.Feature,
                upgradeRequired = true
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetScores(CancellationToken cancellationToken)
    {
        var scores = await _scoringService.GetScoresAsync(cancellationToken);
        return Ok(scores);
    }
}