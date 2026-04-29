using CollectFlow.Domain.Enums;
using CollectFlow.Infrastructure.Persistence;
using MailKit;
using MailKit.Net.Imap;
using MailKit.Search;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using System.Xml;

public class EmailReplySyncService : IEmailReplySyncService
{
    private readonly CollectFlowDbContext _db;

    public EmailReplySyncService(CollectFlowDbContext db)
    {
        _db = db;
    }

    public async Task<int> SyncRepliesAsync(CancellationToken ct)
    {
        int updated = 0;

        using var client = new ImapClient();

        await client.ConnectAsync("imap.gmail.com", 993, true, ct);

        await client.AuthenticateAsync("your-email@mail.collectflowai.com", "APP_PASSWORD", ct);

        var inbox = client.Inbox ?? throw new InvalidOperationException("Inbox is null.");
        _ = await inbox.OpenAsync(FolderAccess.ReadOnly, ct);

        var uids = await inbox.SearchAsync(SearchQuery.NotSeen, ct);

        foreach (var uid in uids)
        {
            var message = await inbox.GetMessageAsync(uid, ct);

            var fromEmail = message.From.Mailboxes.FirstOrDefault()?.Address?.ToLower();

            if (string.IsNullOrWhiteSpace(fromEmail))
                continue;

            var lead = await _db.Leads
                .FirstOrDefaultAsync(x => x.Email.ToLower() == fromEmail, ct);

            if (lead is null)
                continue;

            lead.Stage = "Replied";
            lead.LastRepliedAtUtc = DateTime.UtcNow;

            updated++;
        }

        await _db.SaveChangesAsync(ct);
        await client.DisconnectAsync(true, ct);

        return updated;
    }
}