using CollectFlow.Domain.Enums;

namespace CollectFlow.Application.DTOs.Collections;

public class CollectionActionResponse
{
    public Guid Id { get; set; }
    public Guid InvoiceId { get; set; }
    public Guid CustomerId { get; set; }

    public string InvoiceNumber { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;

    public CollectionActionType ActionType { get; set; }
    public CollectionActionStatus Status { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;

    public DateTime ScheduledForUtc { get; set; }
    public DateTime? CompletedAtUtc { get; set; }

    public string ErrorMessage { get; set; } = string.Empty;
}