using CollectFlow.Application.DTOs.Plans;

namespace CollectFlow.Application.Interfaces;

public interface IPlanLimitService
{
    Task<PlanLimitsResponse> GetCurrentLimitsAsync(CancellationToken cancellationToken = default);

    Task EnsureCanCreateCustomerAsync(CancellationToken cancellationToken = default);
    Task EnsureCanCreateInvoiceAsync(CancellationToken cancellationToken = default);
    Task EnsureCanRunRemindersAsync(CancellationToken cancellationToken = default);
    Task EnsureCanRunScoringAsync(CancellationToken cancellationToken = default);
}