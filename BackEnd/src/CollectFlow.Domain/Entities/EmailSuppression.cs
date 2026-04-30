using CollectFlow.Domain.Enums;

namespace CollectFlow.Domain.Entities;

public class EmailSuppression : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public SuppressionReason Reason { get; set; } = SuppressionReason.Unsubscribed;
    public string Source { get; set; } = string.Empty;
}