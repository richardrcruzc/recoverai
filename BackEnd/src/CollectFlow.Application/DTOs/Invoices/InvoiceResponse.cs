using CollectFlow.Domain.Enums;

namespace CollectFlow.Application.DTOs.Invoices;

public class InvoiceResponse
{
    public Guid Id { get; set; }
    public Guid CustomerId { get; set; }

    public string CustomerName { get; set; } = string.Empty;

    public string InvoiceNumber { get; set; } = string.Empty;

    public DateOnly IssueDate { get; set; }
    public DateOnly DueDate { get; set; }

    public decimal Amount { get; set; }
    public decimal Balance { get; set; }

    public InvoiceStatus Status { get; set; }

    public int DaysOverdue { get; set; }
}