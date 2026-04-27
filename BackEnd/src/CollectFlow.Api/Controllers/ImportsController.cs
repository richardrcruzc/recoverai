using CollectFlow.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CollectFlow.Api.Controllers;

[ApiController]
[Route("api/imports")]
[Authorize]
public class ImportsController : ControllerBase
{
    private readonly IInvoiceImportService _invoiceImportService;

    public ImportsController(IInvoiceImportService invoiceImportService)
    {
        _invoiceImportService = invoiceImportService;
    }

    [HttpPost("invoices")]
    [RequestSizeLimit(10_000_000)]
    public async Task<IActionResult> ImportInvoices(
        IFormFile file,
        CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0)
            return BadRequest(new { message = "CSV file is required." });

        if (!file.FileName.EndsWith(".csv", StringComparison.OrdinalIgnoreCase))
            return BadRequest(new { message = "Only CSV files are supported." });

        await using var stream = file.OpenReadStream();

        var result = await _invoiceImportService.ImportAsync(stream, cancellationToken);

        return Ok(result);
    }
}