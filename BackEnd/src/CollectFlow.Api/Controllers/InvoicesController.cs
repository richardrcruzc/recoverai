using CollectFlow.Application.DTOs.Invoices;
using CollectFlow.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CollectFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class InvoicesController : ControllerBase
{
    private readonly IInvoiceService _service;

    public InvoicesController(IInvoiceService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? status)
    {
        var result = await _service.GetAllAsync(status);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateInvoiceRequest request)
    {
        var result = await _service.CreateAsync(request);
        return Ok(result);
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, UpdateInvoiceStatusRequest request)
    {
        var result = await _service.UpdateStatusAsync(id, request);
        return result == null ? NotFound() : Ok(result);
    }
}