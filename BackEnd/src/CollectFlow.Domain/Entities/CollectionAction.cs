using CollectFlow.Domain.Enums;

namespace CollectFlow.Domain.Entities;

public class CollectionAction : BaseEntity
{
    public Guid TenantId { get; set; }

    public Guid InvoiceId { get; set; }
    public Invoice Invoice { get; set; } = default!;

    public Guid CustomerId { get; set; }
    public Customer Customer { get; set; } = default!;

    public CollectionActionType ActionType { get; set; }
    public CollectionActionStatus Status { get; set; } = CollectionActionStatus.Pending;

    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;

    public DateTime ScheduledForUtc { get; set; }
    public DateTime? CompletedAtUtc { get; set; }

    public string ErrorMessage { get; set; } = string.Empty;
}