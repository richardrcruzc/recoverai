using CollectFlow.Domain.Enums;

namespace CollectFlow.Application.DTOs.Scoring;

public class InvoiceScoreResponse
{
    public Guid Id { get; set; }
    public Guid InvoiceId { get; set; }
    public Guid CustomerId { get; set; }

    public string InvoiceNumber { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerCompanyName { get; set; } = string.Empty;

    public int Score { get; set; }
    public CollectionPriority Priority { get; set; }

    public int DaysOverdue { get; set; }
    public decimal Balance { get; set; }
    public int ReminderCount { get; set; }
    public int PaymentCount { get; set; }

    public string Reason { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
    public DateTime? UpdatedAtUtc { get; set; }
}