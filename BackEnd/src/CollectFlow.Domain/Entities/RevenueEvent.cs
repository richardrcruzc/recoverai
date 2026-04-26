namespace CollectFlow.Domain.Entities;

public class RevenueEvent : BaseEntity
{
    public Guid TenantId { get; set; }
    public string EventType { get; set; } = string.Empty;
    public string Metadata { get; set; } = string.Empty;
}