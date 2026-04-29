using CollectFlow.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace CollectFlow.Domain.Entities;

public class Lead : BaseEntity
{
    public Guid? TenantId { get; set; }
    public Tenant? Tenant { get; set; }

    public string Name { get; set; } = string.Empty;
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string InvoiceVolume { get; set; } = string.Empty;
    public string BiggestProblem { get; set; } = string.Empty;
    public string Source { get; set; } = "landing-page";
    public LeadStatus Status { get; set; } = LeadStatus.New;
    public string Stage { get; set; } = "New";
    // New, Contacted, Qualified, Activated, Converted, Lost

    public int Score { get; set; } = 0;

    public DateTime? LastContactedAtUtc { get; set; }
    public DateTime? LastRepliedAtUtc { get; set; }
    public string Message { get; set; } = "New";
}
