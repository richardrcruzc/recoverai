using CollectFlow.Domain.Enums;

namespace CollectFlow.Application.DTOs.Reminders;

public class ReminderLogResponse
{
    public Guid Id { get; set; }
    public Guid InvoiceId { get; set; }
    public Guid CustomerId { get; set; }

    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string InvoiceNumber { get; set; } = string.Empty;

    public string Channel { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public ReminderStatus Status { get; set; }

    public DateTime CreatedAtUtc { get; set; }
    public DateTime? SentAtUtc { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;
}