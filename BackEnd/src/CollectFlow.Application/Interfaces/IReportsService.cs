using CollectFlow.Application.DTOs.Reports;

public interface IReportsService
{
    Task<RecoverySummaryResponse> GetRecoverySummaryAsync(CancellationToken cancellationToken = default);

    Task<SalesFunnelResponse> GetSalesFunnelAsync(CancellationToken ct);
}