using System.ComponentModel.DataAnnotations;
using CollectFlow.Domain.Enums;

namespace CollectFlow.Application.DTOs.Invoices;

public class CreateInvoiceRequest
{
    [Required]
    public Guid TenantId { get; set; }

    [Required]
    public Guid CustomerId { get; set; }

    [Required]
    public string InvoiceNumber { get; set; } = string.Empty;

    [Required]
    public DateOnly IssueDate { get; set; }

    [Required]
    public DateOnly DueDate { get; set; }

    public decimal Amount { get; set; }
    public decimal Balance { get; set; }

    public string Currency { get; set; } = "USD";

    public InvoiceStatus Status { get; set; } = InvoiceStatus.Sent;
}