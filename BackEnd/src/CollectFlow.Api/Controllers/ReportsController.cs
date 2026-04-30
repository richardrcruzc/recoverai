using CollectFlow.Application.Interfaces;
using CollectFlow.Infrastructure.Migrations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CollectFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly IReportsService _reportService;

    public ReportsController(IReportsService reportService)
    {
        _reportService = reportService;
    }

    [HttpGet("recovery-summary")]
    public async Task<IActionResult> GetRecoverySummary(CancellationToken cancellationToken)
    {
        var result = await _reportService.GetRecoverySummaryAsync(cancellationToken);
        return Ok(result);
    }
    [HttpGet("sales-funnel")]
    public async Task<IActionResult> GetFunnel(CancellationToken ct)
    {
        var result = await _reportService.GetSalesFunnelAsync(ct);
        return Ok(result);
    }
    [HttpGet("sales-funnel/daily-trend")]
    public async Task<IActionResult> GetDailyTrend(CancellationToken ct)
    {
        var result = await _reportService.GetSalesFunnelDailyTrendAsync(ct);
        return Ok(result);
    }
}