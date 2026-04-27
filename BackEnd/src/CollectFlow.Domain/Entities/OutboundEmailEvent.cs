using CollectFlow.Domain.Entities;

public class OutboundEmailEvent : BaseEntity
{
    public Guid? EmailSendId { get; set; }
    public string ProviderMessageId { get; set; } = "";
    public string EventType { get; set; } = "";
    public string Url { get; set; } = "";
    public string RawJson { get; set; } = "";
    public DateTime EventAtUtc { get; set; }
}