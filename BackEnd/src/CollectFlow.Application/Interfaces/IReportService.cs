using CollectFlow.Application.DTOs.Reports;

namespace CollectFlow.Application.Interfaces;

public interface IReportService
{
    Task<RecoverySummaryResponse> GetRecoverySummaryAsync(CancellationToken cancellationToken = default);
}