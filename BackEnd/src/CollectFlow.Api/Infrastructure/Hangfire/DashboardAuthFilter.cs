using Hangfire.Dashboard;

namespace CollectFlow.Api.Infrastructure.Hangfire;

public class DashboardAuthFilter : IDashboardAuthorizationFilter
{
    public bool Authorize(DashboardContext context)
    {
        var http = context.GetHttpContext();

        if (!http.User.Identity?.IsAuthenticated ?? true)
            return false;

        // Option A: require Admin role claim
        if (http.User.IsInRole("Admin"))
            return true;

        // Option B (fallback): allow specific email(s)
        var email = http.User.Claims.FirstOrDefault(c => c.Type == "email")?.Value;
        return email != null && email.EndsWith("@collectflowai.com", StringComparison.OrdinalIgnoreCase);
    }
}