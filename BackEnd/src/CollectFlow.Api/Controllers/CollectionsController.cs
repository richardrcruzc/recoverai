using CollectFlow.Application.DTOs.Collections;
using CollectFlow.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CollectFlow.Api.Controllers;

[ApiController]
[Route("api/collections")]
[Authorize]
public class CollectionsController : ControllerBase
{
    private readonly ICollectionsEngineService _collectionsEngineService;

    public CollectionsController(ICollectionsEngineService collectionsEngineService)
    {
        _collectionsEngineService = collectionsEngineService;
    }

    [HttpPost("run")]
    public async Task<IActionResult> Run(CancellationToken cancellationToken)
    {
        var result = await _collectionsEngineService.RunAsync(cancellationToken);
        return Ok(result);
    }

    [HttpGet("actions")]
    public async Task<IActionResult> GetActions(CancellationToken cancellationToken)
    {
        var result = await _collectionsEngineService.GetActionsAsync(cancellationToken);
        return Ok(result);
    }

    [HttpPatch("actions/{id:guid}/complete")]
    public async Task<IActionResult> CompleteAction(
        Guid id,
        [FromBody] CompleteCollectionActionRequest request,
        CancellationToken cancellationToken)
    {
        var completed = await _collectionsEngineService.CompleteActionAsync(
            id,
            request,
            cancellationToken);

        return completed
            ? NoContent()
            : NotFound(new { message = "Collection action not found." });
    }
}