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
        var result = await _scoringService.RunAsync(cancellationToken);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetScores(CancellationToken cancellationToken)
    {
        var scores = await _scoringService.GetScoresAsync(cancellationToken);
        return Ok(scores);
    }
}