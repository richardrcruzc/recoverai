using CollectFlow.Application.DTOs.LeadScraping;
using CollectFlow.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CollectFlow.Api.Controllers;

[ApiController]
[Route("api/lead-scraping")]
[Authorize]
public class LeadScrapingController : ControllerBase
{
    private readonly ILeadScrapingService _leadScrapingService;

    public LeadScrapingController(ILeadScrapingService leadScrapingService)
    {
        _leadScrapingService = leadScrapingService;
    }

    [HttpPost("run")]
    public async Task<IActionResult> Run(
        [FromBody] RunLeadScrapeRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _leadScrapingService.RunAsync(request, cancellationToken);
        return Ok(result);
    }
}