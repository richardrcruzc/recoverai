using CollectFlow.Application.Common;
using CollectFlow.Application.DTOs.Customers;
using CollectFlow.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CollectFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CustomersController : ControllerBase
{
    private readonly ICustomerService _customerService;

    public CustomersController(ICustomerService customerService)
    {
        _customerService = customerService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var customers = await _customerService.GetAllAsync(cancellationToken);
        return Ok(customers);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var customer = await _customerService.GetByIdAsync(id, cancellationToken);
        return customer is null ? NotFound(new { message = "Customer not found." }) : Ok(customer);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCustomerRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var customer = await _customerService.CreateAsync(request, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = customer.Id }, customer);
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

    [HttpPatch("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCustomerRequest request, CancellationToken cancellationToken)
    {
        var customer = await _customerService.UpdateAsync(id, request, cancellationToken);
        return customer is null ? NotFound(new { message = "Customer not found." }) : Ok(customer);
    }
}
