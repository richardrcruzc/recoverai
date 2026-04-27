using CollectFlow.Application.DTOs.Outbound;
using CollectFlow.Application.Interfaces;
using CollectFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CollectFlow.Infrastructure.Services;

public class OutboundQueryService : IOutboundQueryService
{
    private readonly CollectFlowDbContext _db;

    public OutboundQueryService(CollectFlowDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<OutboundContactResponse>> GetContactsAsync(
        CancellationToken cancellationToken = default)
    {
        return await _db.OutboundContacts
            .AsNoTracking()
            .OrderByDescending(x => x.Score)
            .ThenBy(x => x.CompanyName)
            .Select(x => new OutboundContactResponse
            {
                Id = x.Id,
                CompanyName = x.CompanyName,
                Website = x.Website,
                Industry = x.Industry,
                ContactName = x.ContactName,
                Title = x.Title,
                Email = x.Email,
                LinkedInUrl = x.LinkedInUrl,
                Score = x.Score,
                Status = x.Status,
                IsUnsubscribed = x.IsUnsubscribed
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<OutboundEmailSendResponse>> GetSendsAsync(
        CancellationToken cancellationToken = default)
    {
        return await _db.OutboundEmailSends
            .AsNoTracking()
            .Include(x => x.Contact)
            .Include(x => x.Campaign)
            .OrderByDescending(x => x.CreatedAtUtc)
            .Select(x => new OutboundEmailSendResponse
            {
                Id = x.Id,
                ContactId = x.ContactId,
                CampaignId = x.CampaignId,
                CompanyName = x.Contact.CompanyName,
                ContactName = x.Contact.ContactName,
                Email = x.Contact.Email,
                CampaignName = x.Campaign.Name,
                ProviderMessageId = x.ProviderMessageId,
                Status = x.Status,
                SentAtUtc = x.SentAtUtc,
                DeliveredAtUtc = x.DeliveredAtUtc,
                OpenedAtUtc = x.OpenedAtUtc,
                ClickedAtUtc = x.ClickedAtUtc,
                BouncedAtUtc = x.BouncedAtUtc,
                LastEvent = x.LastEvent
            })
            .ToListAsync(cancellationToken);
    }
}