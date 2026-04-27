using CollectFlow.Application.DTOs.Reminders;
using CollectFlow.Application.Interfaces;
using CollectFlow.Infrastructure.Persistence;
using CollectFlow.Infrastructure.Tenancy;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace CollectFlow.Infrastructure.Services;

public class TenantJobRunner : ITenantJobRunner
{
    private readonly IServiceScopeFactory _scopeFactory;

    public TenantJobRunner(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    public async Task RunReminderJobsForAllTenantsAsync(
        CancellationToken cancellationToken = default)
    {
        List<Guid> tenantIds;

        using (var scope = _scopeFactory.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<CollectFlowDbContext>();

            tenantIds = await db.Tenants
                .IgnoreQueryFilters()
                .Where(x => x.IsActive)
                .Select(x => x.Id)
                .ToListAsync(cancellationToken);
        }

        foreach (var tenantId in tenantIds)
        {
            using var tenantScope = _scopeFactory.CreateScope();

            var tenantContext = tenantScope.ServiceProvider.GetRequiredService<TenantContext>();
            tenantContext.SetTenant(tenantId);

            var reminderService = tenantScope.ServiceProvider.GetRequiredService<IReminderService>();

            await reminderService.RunAsync(
                new RunReminderRequest
                {
                    MinimumDaysOverdue = 1,
                    SendEmails = true
                },
                cancellationToken);
        }
    }
}