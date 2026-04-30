using CollectFlow.Domain.Enums;

namespace CollectFlow.Application.DTOs.Leads;

public class LeadResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string InvoiceVolume { get; set; } = string.Empty;
    public string BiggestProblem { get; set; } = string.Empty;
    public string Source { get; set; } = string.Empty;
    public LeadStatus Status { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public LeadStage Stage { get; set; }
}
