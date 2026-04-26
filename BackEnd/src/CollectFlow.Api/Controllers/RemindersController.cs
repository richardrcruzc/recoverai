using CollectFlow.Application.Common;
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
        try
        {
            var result = await _reminderService.RunAsync(request, cancellationToken);
            return Ok(result);
        }
        catch (PaywallException ex)
        {
            return StatusCode(StatusCodes.Status402PaymentRequired, new
            {
            message = ex.Message,
                feature = ex.Feature,
                upgradeRequired = true
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("logs")]
    public async Task<IActionResult> GetLogs(CancellationToken cancellationToken)
    {
        var logs = await _reminderService.GetLogsAsync(cancellationToken);
        return Ok(logs);
    }
}