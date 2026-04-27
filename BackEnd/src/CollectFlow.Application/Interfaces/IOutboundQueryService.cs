using CollectFlow.Application.DTOs.Outbound;

namespace CollectFlow.Application.Interfaces;

public interface IOutboundQueryService
{
    Task<IReadOnlyList<OutboundContactResponse>> GetContactsAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<OutboundEmailSendResponse>> GetSendsAsync(CancellationToken cancellationToken = default);
}