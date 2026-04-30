using CollectFlow.Domain.Enums;

namespace CollectFlow.Application.Interfaces;

public interface IEmailComplianceService
{
    Task<bool> IsSuppressedAsync(string email, CancellationToken cancellationToken = default);
    Task<string> CreateUnsubscribeUrlAsync(string email, CancellationToken cancellationToken = default);
    Task<bool> UnsubscribeAsync(string token, CancellationToken cancellationToken = default);
    Task AddSuppressionAsync(string email, SuppressionReason reason, string source, CancellationToken cancellationToken = default);
}