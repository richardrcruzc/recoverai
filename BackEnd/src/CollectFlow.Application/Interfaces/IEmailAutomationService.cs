using CollectFlow.Application.DTOs.EmailAutomation;

namespace CollectFlow.Application.Interfaces;

public interface IEmailAutomationService
{
    Task QueueLeadSequenceAsync(Guid leadId, CancellationToken cancellationToken = default);
    Task<RunEmailAutomationResponse> RunDueJobsAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<EmailAutomationJobResponse>> GetJobsAsync(CancellationToken cancellationToken = default);
}