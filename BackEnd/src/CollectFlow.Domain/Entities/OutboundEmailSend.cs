using CollectFlow.Domain.Entities;

public class OutboundEmailSend : BaseEntity
{
    public Guid ContactId { get; set; }
    public OutboundContact Contact { get; set; } = default!;

    public Guid CampaignId { get; set; }
    public OutboundCampaign Campaign { get; set; } = default!;

    public string ProviderMessageId { get; set; } = "";
    public string Status { get; set; } = "Queued";
    public DateTime? SentAtUtc { get; set; }
    public DateTime? DeliveredAtUtc { get; set; }
    public DateTime? OpenedAtUtc { get; set; }
    public DateTime? ClickedAtUtc { get; set; }
    public DateTime? BouncedAtUtc { get; set; }
    public string LastEvent { get; set; } = "";
}