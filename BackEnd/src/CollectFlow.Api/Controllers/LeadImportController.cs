using CollectFlow.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CollectFlow.Api.Controllers;

[ApiController]
[Route("api/leads/import")]
[Authorize]
public class LeadImportController : ControllerBase
{
    private readonly ILeadImportService _leadImportService;

    public LeadImportController(ILeadImportService leadImportService)
    {
        _leadImportService = leadImportService;
    }

    [HttpPost("csv")]
    [RequestSizeLimit(10_000_000)]
    public async Task<IActionResult> ImportCsv(
        IFormFile file,
        CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0)
            return BadRequest(new { message = "CSV file is required." });

        if (!file.FileName.EndsWith(".csv", StringComparison.OrdinalIgnoreCase))
            return BadRequest(new { message = "Only CSV files are supported." });

        await using var stream = file.OpenReadStream();

        var result = await _leadImportService.ImportCsvAsync(stream, cancellationToken);

        return Ok(result);
    }
}