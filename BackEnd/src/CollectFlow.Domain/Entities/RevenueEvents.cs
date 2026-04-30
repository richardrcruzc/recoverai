using CollectFlow.Domain.Entities;

public class RevenueEvent : BaseEntity
{
    public Guid TenantId { get; set; }
    public string EventType { get; set; } = "";
    public string Metadata { get; set; } = "";
    public decimal Amount { get; set; }
}