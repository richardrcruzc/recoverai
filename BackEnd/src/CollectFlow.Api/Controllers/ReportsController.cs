using CollectFlow.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CollectFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpGet("recovery-summary")]
    public async Task<IActionResult> GetRecoverySummary(CancellationToken cancellationToken)
    {
        var result = await _reportService.GetRecoverySummaryAsync(cancellationToken);
        return Ok(result);
    }
}