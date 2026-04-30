using CollectFlow.Application.DTOs.Leads;
using CollectFlow.Application.Interfaces;
using CollectFlow.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace CollectFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LeadsController : ControllerBase
{
    private readonly ILeadService _leadService;
    private readonly ILeadPipelineService _pipeline;

    public LeadsController(ILeadService leadService, ILeadPipelineService pipeline)
    {
        _leadService = leadService;
        _pipeline = pipeline;
    }

    // Public endpoint. Landing page visitors can submit demo requests.
    [EnableRateLimiting("public-forms")]
    [HttpPost]
    [AllowAnonymous]
    [ProducesResponseType(typeof(LeadResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateLeadRequest request, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var result = await _leadService.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetAll), new { id = result.Id }, result);
    }

    // Protected endpoint. Admin users only.
    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(IReadOnlyList<LeadResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var result = await _leadService.GetAllAsync(cancellationToken);
        return Ok(result);
    }

    // Protected endpoint. Admin users only.
    [HttpPatch("{id:guid}/status")]
    [Authorize]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateLeadStatusRequest request, CancellationToken cancellationToken)
    {
        var updated = await _leadService.UpdateStatusAsync(id, request.Status, cancellationToken);
        return updated ? NoContent() : BadRequest(new { message = "Lead not found or invalid status." });
    }
    [HttpPatch("{id:guid}/stage")]
    public async Task<IActionResult> UpdateStage(
    Guid id,
    [FromBody] int stage,
    CancellationToken ct)
    {
        var success = await _pipeline.UpdateStageAsync(id, (LeadStage)stage, ct);

        return success ? NoContent() : NotFound();
    }

    [HttpPatch("{id:guid}/note")]
    public async Task<IActionResult> AddNote(
        Guid id,
        [FromBody] string note,
        CancellationToken ct)
    {
        var success = await _pipeline.AddNoteAsync(id, note, ct);

        return success ? NoContent() : NotFound();
    }
}

public class UpdateLeadStatusRequest
{
    public string Status { get; set; } = string.Empty;
}
