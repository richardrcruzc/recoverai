using CollectFlow.Application.DTOs.Leads;

namespace CollectFlow.Application.Interfaces;

public interface ILeadService
{
    Task<LeadResponse> CreateAsync(CreateLeadRequest request, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<LeadResponse>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<bool> UpdateStatusAsync(Guid id, string status, CancellationToken cancellationToken = default);
}
