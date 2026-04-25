using CollectFlow.Application.DTOs.Onboarding;
using CollectFlow.Domain.Entities;
using CollectFlow.Domain.Enums;
using CollectFlow.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CollectFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OnboardingController : ControllerBase
{
    private readonly CollectFlowDbContext _db;
    private readonly PasswordHasher<AdminUser> _passwordHasher;

    public OnboardingController(
        CollectFlowDbContext db,
        PasswordHasher<AdminUser> passwordHasher)
    {
        _db = db;
        _passwordHasher = passwordHasher;
    }

    [HttpPost("tenant")]
    [AllowAnonymous]
    public async Task<IActionResult> CreateTenant(
        [FromBody] TenantOnboardingRequest request,
        CancellationToken cancellationToken)
    {
        var slug = request.TenantSlug.Trim().ToLowerInvariant();
        var email = request.AdminEmail.Trim().ToLowerInvariant();

        var tenantExists = await _db.Tenants.AnyAsync(x => x.Slug == slug, cancellationToken);
        if (tenantExists)
            return BadRequest(new { message = "Workspace slug is already taken." });

        var adminExists = await _db.AdminUsers.AnyAsync(x => x.Email == email, cancellationToken);
        if (adminExists)
            return BadRequest(new { message = "Admin email already exists." });

        var tenant = new Tenant
        {
            Id = Guid.NewGuid(),
            Name = request.CompanyName.Trim(),
            Slug = slug,
            IsActive = true
        };

        var admin = new AdminUser
        {
            FullName = request.AdminFullName.Trim(),
            Email = email,
            Role = AdminUserRole.Admin,
            IsActive = true
        };

        admin.PasswordHash = _passwordHasher.HashPassword(admin, request.Password);

        _db.Tenants.Add(tenant);
        _db.AdminUsers.Add(admin);

        await _db.SaveChangesAsync(cancellationToken);

        return Ok(new TenantOnboardingResponse
        {
            TenantId = tenant.Id,
            TenantName = tenant.Name,
            AdminEmail = admin.Email
        });
    }
}