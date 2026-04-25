using CollectFlow.Application.DTOs.Reminders;
using CollectFlow.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CollectFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RemindersController : ControllerBase
{
    private readonly IReminderService _reminderService;

    public RemindersController(IReminderService reminderService)
    {
        _reminderService = reminderService;
    }

    [HttpPost("run")]
    public async Task<IActionResult> Run(
        [FromBody] RunReminderRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _reminderService.RunAsync(request, cancellationToken);
        return Ok(result);
    }

    [HttpGet("logs")]
    public async Task<IActionResult> GetLogs(CancellationToken cancellationToken)
    {
        var logs = await _reminderService.GetLogsAsync(cancellationToken);
        return Ok(logs);
    }
}