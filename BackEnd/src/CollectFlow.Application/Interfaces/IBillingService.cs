using CollectFlow.Application.DTOs.Billing;

namespace CollectFlow.Application.Interfaces;

public interface IBillingService
{
    Task<BillingSummaryResponse> GetSummaryAsync(CancellationToken cancellationToken = default);
}