using CollectFlow.Domain.Enums;

namespace CollectFlow.Domain.Entities;

public class EmailAutomationJob : BaseEntity
{
    public Guid? TenantId { get; set; }

    public Guid? LeadId { get; set; }
    public Lead? Lead { get; set; }

    public Guid? AdminUserId { get; set; }
    public AdminUser? AdminUser { get; set; }

    public string CampaignKey { get; set; } = string.Empty;
    public string RecipientEmail { get; set; } = string.Empty;
    public string RecipientName { get; set; } = string.Empty;

    public string Subject { get; set; } = string.Empty;
    public string BodyHtml { get; set; } = string.Empty;

    public DateTime ScheduledForUtc { get; set; }
    public DateTime? SentAtUtc { get; set; }

    public EmailAutomationStatus Status { get; set; } = EmailAutomationStatus.Pending;
    public string ErrorMessage { get; set; } = string.Empty;
}