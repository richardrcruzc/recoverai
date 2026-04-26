using CollectFlow.Domain.Enums;

namespace CollectFlow.Application.DTOs.EmailAutomation;

public class EmailAutomationJobResponse
{
    public Guid Id { get; set; }
    public Guid? TenantId { get; set; }
    public Guid? LeadId { get; set; }

    public string CampaignKey { get; set; } = string.Empty;
    public string RecipientEmail { get; set; } = string.Empty;
    public string RecipientName { get; set; } = string.Empty;

    public string Subject { get; set; } = string.Empty;
    public DateTime ScheduledForUtc { get; set; }
    public DateTime? SentAtUtc { get; set; }

    public EmailAutomationStatus Status { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;
}