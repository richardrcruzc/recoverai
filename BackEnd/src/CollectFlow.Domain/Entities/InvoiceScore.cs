using CollectFlow.Domain.Enums;

namespace CollectFlow.Domain.Entities;

public class InvoiceScore : BaseEntity
{
    public Guid TenantId { get; set; }

    public Guid InvoiceId { get; set; }
    public Invoice Invoice { get; set; } = default!;

    public Guid CustomerId { get; set; }
    public Customer Customer { get; set; } = default!;

    public int Score { get; set; }
    public CollectionPriority Priority { get; set; }

    public int DaysOverdue { get; set; }
    public decimal Balance { get; set; }
    public int ReminderCount { get; set; }
    public int PaymentCount { get; set; }

    public string Reason { get; set; } = string.Empty;
}