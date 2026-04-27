using CollectFlow.Infrastructure.Persistence;
using Microsoft.Extensions.Configuration;

using Microsoft.EntityFrameworkCore;

public class OutboundEmailService : IOutboundEmailService
{
    private readonly CollectFlowDbContext _db;
    private readonly ISendGridOutboundService _sendGrid;
    private readonly IConfiguration _configuration;

    public OutboundEmailService(
        CollectFlowDbContext db,
        ISendGridOutboundService sendGrid,
        IConfiguration configuration)
    {
        _db = db;
        _sendGrid = sendGrid;
        _configuration = configuration;
    }

    public async Task<int> SendCampaignAsync(
        Guid campaignId,
        int limit,
        CancellationToken cancellationToken = default)
    {
        var campaign = await _db.OutboundCampaigns.FirstAsync(x => x.Id == campaignId, cancellationToken);

        var contacts = await _db.OutboundContacts
            .Where(x =>
                !x.IsUnsubscribed &&
                x.Status == "Verified" &&
                !string.IsNullOrWhiteSpace(x.Email))
            .OrderByDescending(x => x.Score)
            .Take(limit)
            .ToListAsync(cancellationToken);

        var sent = 0;

        foreach (var contact in contacts)
        {
            var unsubscribeUrl = $"{_configuration["SendGrid:UnsubscribeBaseUrl"]}/{contact.Id}";

            var body = campaign.BodyHtml
                .Replace("[First Name]", contact.ContactName.Split(' ').FirstOrDefault() ?? "there")
                .Replace("[Company]", contact.CompanyName);

            var messageId = await _sendGrid.SendOutboundAsync(
                contact.Email,
                contact.ContactName,
                campaign.Subject,
                body,
                unsubscribeUrl,
                cancellationToken);

            _db.OutboundEmailSends.Add(new OutboundEmailSend
            {
                ContactId = contact.Id,
                CampaignId = campaign.Id,
                ProviderMessageId = messageId,
                Status = "Sent",
                SentAtUtc = DateTime.UtcNow,
                LastEvent = "sent"
            });

            contact.Status = "Contacted";
            sent++;
        }

        await _db.SaveChangesAsync(cancellationToken);
        return sent;
    }
}