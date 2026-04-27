using CollectFlow.Domain.Entities;

public class OutboundContact : BaseEntity
{
    public string CompanyName { get; set; } = "";
    public string Website { get; set; } = "";
    public string Industry { get; set; } = "";
    public string ContactName { get; set; } = "";
    public string Title { get; set; } = "";
    public string Email { get; set; } = "";
    public string LinkedInUrl { get; set; } = "";
    public int Score { get; set; }
    public string Status { get; set; } = "New";
    public bool IsUnsubscribed { get; set; }
}