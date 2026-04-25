namespace CollectFlow.Domain.Entities;

public class Payment : BaseEntity
{
    public Guid TenantId { get; set; }

    public Guid InvoiceId { get; set; }
    public Invoice Invoice { get; set; } = default!;

    public Guid CustomerId { get; set; }
    public Customer Customer { get; set; } = default!;

    public decimal Amount { get; set; }
    public string Currency { get; set; } = "USD";
    public DateOnly PaymentDate { get; set; }
    public string ReferenceNumber { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
}