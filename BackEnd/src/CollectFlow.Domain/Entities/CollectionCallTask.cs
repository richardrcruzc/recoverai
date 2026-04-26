using CollectFlow.Domain.Enums;

namespace CollectFlow.Domain.Entities;

public class CollectionCallTask : BaseEntity
{
    public Guid TenantId { get; set; }

    public Guid InvoiceId { get; set; }
    public Invoice Invoice { get; set; } = default!;

    public Guid CustomerId { get; set; }
    public Customer Customer { get; set; } = default!;

    public string Reason { get; set; } = string.Empty;
    public string SuggestedScript { get; set; } = string.Empty;

    public CollectionActionStatus Status { get; set; } = CollectionActionStatus.Pending;
    public string Outcome { get; set; } = string.Empty;

    public DateTime? CompletedAtUtc { get; set; }
}