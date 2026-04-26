namespace CollectFlow.Domain.Entities;

public class RecoveryFee : BaseEntity
{
    public Guid TenantId { get; set; }

    public Guid PaymentId { get; set; }
    public Payment Payment { get; set; } = default!;

    public Guid InvoiceId { get; set; }
    public Guid CustomerId { get; set; }

    public decimal RecoveredAmount { get; set; }
    public decimal FeeRate { get; set; }
    public decimal FeeAmount { get; set; }

    public string Currency { get; set; } = "USD";
    public bool IsBilled { get; set; }
    public DateTime? BilledAtUtc { get; set; }
}