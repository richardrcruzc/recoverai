using CollectFlow.Application.DTOs.EmailAutomation;
using CollectFlow.Domain.Entities;

namespace CollectFlow.Application.Interfaces;

public interface IEmailAutomationService
{
    Task QueueLeadSequenceAsync(Guid leadId, CancellationToken cancellationToken = default);
    Task<RunEmailAutomationResponse> RunDueJobsAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<EmailAutomationJobResponse>> GetJobsAsync(CancellationToken cancellationToken = default);
    Task<int> SendLeadCampaignAsync(
     string campaignKey,
     string subject,
     Func<Lead, string> bodyBuilder,
     CancellationToken ct = default);
}