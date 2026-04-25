using CollectFlow.Domain.Enums;

namespace CollectFlow.Domain.Entities;

public class ReminderLog : BaseEntity
{
    public Guid TenantId { get; set; }

    public Guid InvoiceId { get; set; }
    public Invoice Invoice { get; set; } = default!;

    public Guid CustomerId { get; set; }
    public Customer Customer { get; set; } = default!;

    public string Channel { get; set; } = "Email";
    public string Subject { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;

    public ReminderStatus Status { get; set; } = ReminderStatus.Pending;
    public string ErrorMessage { get; set; } = string.Empty;

    public DateTime? SentAtUtc { get; set; }
}