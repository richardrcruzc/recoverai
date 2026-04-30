using CollectFlow.Application.DTOs.EmailAutomation;
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
    private readonly ILeadService _leadService;
    public EmailAutomationController(IEmailAutomationService emailAutomationService, ILeadService leadService   )
    {
        _emailAutomationService = emailAutomationService;
        _leadService = leadService;
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
    [HttpPost("queue-all-leads")]
    public async Task<IActionResult> QueueAllLeads(CancellationToken ct)
    {
        var leads = await _leadService.GetAllAsync(ct);

        foreach (var lead in leads)
        {
            await _emailAutomationService.QueueLeadSequenceAsync(lead.Id, ct);
        }

        return Ok(new { queued = leads.Count });
    }
    [HttpPost("queue-lead-batch")]
    public async Task<IActionResult> QueueLeadBatch(
    [FromBody] QueueLeadBatchRequest request,
    CancellationToken cancellationToken)
    {
        var result = await _emailAutomationService.QueueLeadBatchAsync(
            request,
            cancellationToken);

        return Ok(result);
    }
}