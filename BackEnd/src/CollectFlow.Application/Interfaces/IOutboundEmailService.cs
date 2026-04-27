public interface IOutboundEmailService
{
    Task<int> SendCampaignAsync(Guid campaignId, int limit, CancellationToken cancellationToken = default);
}