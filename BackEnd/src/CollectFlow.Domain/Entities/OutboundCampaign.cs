using CollectFlow.Domain.Entities;

public class OutboundCampaign : BaseEntity
{
    public string Name { get; set; } = "";
    public string Subject { get; set; } = "";
    public string BodyHtml { get; set; } = "";
    public bool IsActive { get; set; } = true;
}