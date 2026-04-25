using CollectFlow.Application.DTOs.AdminUsers;
using CollectFlow.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CollectFlow.Api.Controllers;

[ApiController]
[Route("api/admin/users")]
[Authorize(Roles = "Admin")]
public class AdminUsersController : ControllerBase
{
    private readonly IAdminUserService _adminUserService;

    public AdminUsersController(IAdminUserService adminUserService)
    {
        _adminUserService = adminUserService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var users = await _adminUserService.GetAllAsync(cancellationToken);
        return Ok(users);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAdminUserRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var user = await _adminUserService.CreateAsync(request, cancellationToken);
            return CreatedAtAction(nameof(GetAll), new { id = user.Id }, user);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> SetActive(Guid id, [FromBody] SetAdminUserStatusRequest request, CancellationToken cancellationToken)
    {
        var updated = await _adminUserService.SetActiveAsync(id, request.IsActive, cancellationToken);
        return updated ? NoContent() : NotFound(new { message = "User not found." });
    }
}

public class SetAdminUserStatusRequest
{
    public bool IsActive { get; set; }
}
