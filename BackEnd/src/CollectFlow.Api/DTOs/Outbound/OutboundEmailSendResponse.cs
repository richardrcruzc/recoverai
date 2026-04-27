namespace CollectFlow.Application.DTOs.Outbound;

public class OutboundEmailSendResponse
{
    public Guid Id { get; set; }
    public Guid ContactId { get; set; }
    public Guid CampaignId { get; set; }

    public string CompanyName { get; set; } = string.Empty;
    public string ContactName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string CampaignName { get; set; } = string.Empty;

    public string ProviderMessageId { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;

    public DateTime? SentAtUtc { get; set; }
    public DateTime? DeliveredAtUtc { get; set; }
    public DateTime? OpenedAtUtc { get; set; }
    public DateTime? ClickedAtUtc { get; set; }
    public DateTime? BouncedAtUtc { get; set; }

    public string LastEvent { get; set; } = string.Empty;
}