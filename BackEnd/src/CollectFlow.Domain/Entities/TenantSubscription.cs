using CollectFlow.Domain.Enums;

namespace CollectFlow.Domain.Entities;

public class TenantSubscription : BaseEntity
{
    public Guid TenantId { get; set; }
    public Tenant Tenant { get; set; } = default!;

    public PlanType Plan { get; set; } = PlanType.Free;
    public bool IsActive { get; set; } = true;

    public string StripeCustomerId { get; set; } = string.Empty;
    public string StripeSubscriptionId { get; set; } = string.Empty;

    public DateTime? CurrentPeriodStartUtc { get; set; }
    public DateTime? CurrentPeriodEndUtc { get; set; }
}