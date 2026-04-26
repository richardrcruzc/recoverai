using CollectFlow.Api.DTOs.Auth;
using CollectFlow.Api.Services;
using CollectFlow.Application.Interfaces;
using CollectFlow.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System.Security.Claims;

namespace CollectFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(JwtTokenService jwtTokenService, IAuthService authService) : ControllerBase
{
    [EnableRateLimiting("public-forms")]
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        var result = await authService.ValidateCredentialsAsync(
            request.Email,
            request.Password,
            cancellationToken);

        if (!result.Success)
            return Unauthorized(new { message = "Invalid email or password." });

        var token = jwtTokenService.CreateToken(result.Email, result.Role, result.TenantId);
        return Ok(token);
    }


    [HttpGet("me")]
    [Authorize]
    public IActionResult Me()
    {
        var email =
            User.FindFirstValue(ClaimTypes.Email) ??
            User.FindFirstValue("email") ??
            string.Empty;

        var role =
            User.FindFirstValue(ClaimTypes.Role) ??
            User.FindFirstValue("role") ??
            "Admin";

        var tenantId = User.FindFirstValue("tenantId") ?? string.Empty;

        return Ok(new
        {
            email,
            role,
            tenantId,
            authenticated = User.Identity?.IsAuthenticated == true
        });
    }
}
