namespace CollectFlow.Application.DTOs.Outbound;

public class OutboundContactResponse
{
    public Guid Id { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string Website { get; set; } = string.Empty;
    public string Industry { get; set; } = string.Empty;
    public string ContactName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string LinkedInUrl { get; set; } = string.Empty;
    public int Score { get; set; }
    public string Status { get; set; } = string.Empty;
    public bool IsUnsubscribed { get; set; }
}