using CollectFlow.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CollectFlow.Api.Controllers;

[ApiController]
[Route("api/email-automation")]
[Authorize]
public class EmailAutomationController : ControllerBase
{
    private readonly IEmailAutomationService _emailAutomationService;

    public EmailAutomationController(IEmailAutomationService emailAutomationService)
    {
        _emailAutomationService = emailAutomationService;
    }

    [HttpPost("run")]
    public async Task<IActionResult> Run(CancellationToken cancellationToken)
    {
        var result = await _emailAutomationService.RunDueJobsAsync(cancellationToken);
        return Ok(result);
    }

    [HttpGet("jobs")]
    public async Task<IActionResult> GetJobs(CancellationToken cancellationToken)
    {
        var jobs = await _emailAutomationService.GetJobsAsync(cancellationToken);
        return Ok(jobs);
    }
}