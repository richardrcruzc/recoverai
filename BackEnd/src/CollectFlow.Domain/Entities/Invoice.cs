using CollectFlow.Domain.Enums;

namespace CollectFlow.Domain.Entities;

public class Invoice : BaseEntity
{
    public Guid TenantId { get; set; }
    public Tenant Tenant { get; set; } = default!;

    public Guid CustomerId { get; set; }
    public Customer Customer { get; set; } = default!;

    public string InvoiceNumber { get; set; } = string.Empty;
    public DateOnly IssueDate { get; set; }
    public DateOnly DueDate { get; set; }
    public decimal Amount { get; set; }
    public decimal Balance { get; set; }
    public string Currency { get; set; } = "USD";
    public InvoiceStatus Status { get; set; } = InvoiceStatus.Sent;
}
