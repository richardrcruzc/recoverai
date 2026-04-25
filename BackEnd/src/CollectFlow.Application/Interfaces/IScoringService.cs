using CollectFlow.Application.DTOs.Scoring;

namespace CollectFlow.Application.Interfaces;

public interface IScoringService
{
    Task<RunScoringResponse> RunAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<InvoiceScoreResponse>> GetScoresAsync(CancellationToken cancellationToken = default);
}