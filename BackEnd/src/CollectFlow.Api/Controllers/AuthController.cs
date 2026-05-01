using CollectFlow.Application.DTOs.Auth;
using CollectFlow.Api.Services;
using CollectFlow.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System.Security.Claims;

namespace CollectFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(
    JwtTokenService jwtTokenService,
    IAuthService authService) : ControllerBase
{
    [HttpGet("debug-cookie")]
    [AllowAnonymous]
    public IActionResult DebugCookie()
    {
        var cookie = Request.Cookies["cf_auth"];

        return Ok(new
        {
            hasCookie = !string.IsNullOrWhiteSpace(cookie),
            cookieLength = cookie?.Length ?? 0
        });
    }
    [EnableRateLimiting("public-forms")]
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login(
        [FromBody] LoginRequest request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "Email and password are required." });
        }

        var result = await authService.ValidateCredentialsAsync(
            request.Email,
            request.Password,
            cancellationToken);

        if (!result.Success)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        var token = jwtTokenService.CreateToken(
            result.Email,
            result.Role,
            result.TenantId);

        if (token is null || string.IsNullOrWhiteSpace(token.AccessToken))
        {
            return Unauthorized(new { message = "Could not create login session." });
        }

        Response.Cookies.Append("cf_auth", token.AccessToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTimeOffset.UtcNow.AddHours(8),
            Path = "/"
        });

        return Ok(new
        {
            result.Email,
            result.Role,
            result.TenantId,
            result.FullName
        });
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

    [HttpPost("logout")]
    [AllowAnonymous]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("cf_auth", new CookieOptions
        {
            Secure = true,
            SameSite = SameSiteMode.None,
            Path = "/"
        });

        return Ok(new { message = "Logged out." });
    }
}