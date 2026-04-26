using CollectFlow.Infrastructure.Tenancy;

namespace CollectFlow.Api.Middleware;

public class TenantMiddleware
{
    private readonly RequestDelegate _next;

    public TenantMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, TenantContext tenantContext)
    {
        var tenantClaim = context.User.FindFirst("tenantId")?.Value;

        if (!string.IsNullOrWhiteSpace(tenantClaim) &&
            Guid.TryParse(tenantClaim, out var tenantId))
        {
            tenantContext.SetTenant(tenantId);
        }

        await _next(context);
    }
}