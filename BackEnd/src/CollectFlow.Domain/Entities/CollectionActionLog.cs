using CollectFlow.Domain.Enums;

namespace CollectFlow.Domain.Entities;

public class CollectionActionLog : BaseEntity
{
    public Guid TenantId { get; set; }

    public Guid InvoiceId { get; set; }
    public Invoice Invoice { get; set; } = default!;

    public Guid CustomerId { get; set; }
    public Customer Customer { get; set; } = default!;

    public CollectionActionType ActionType { get; set; }
    public CollectionActionStatus Status { get; set; } = CollectionActionStatus.Pending;

    public string RuleKey { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string BodyHtml { get; set; } = string.Empty;

    public DateTime? CompletedAtUtc { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;
}