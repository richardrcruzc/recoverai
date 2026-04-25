using CollectFlow.Domain.Enums;

namespace CollectFlow.Domain.Entities;

public class Lead : BaseEntity
{
    public Guid? TenantId { get; set; }
    public Tenant? Tenant { get; set; }

    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string InvoiceVolume { get; set; } = string.Empty;
    public string BiggestProblem { get; set; } = string.Empty;
    public string Source { get; set; } = "landing-page";
    public LeadStatus Status { get; set; } = LeadStatus.New;
}
