namespace CollectFlow.Application.Interfaces;

public interface ITenantJobRunner
{
    Task RunReminderJobsForAllTenantsAsync(CancellationToken cancellationToken = default);
}