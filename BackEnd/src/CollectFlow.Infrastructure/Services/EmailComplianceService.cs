using System.Security.Cryptography;
using CollectFlow.Application.Interfaces;
using CollectFlow.Domain.Entities;
using CollectFlow.Domain.Enums;
using CollectFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace CollectFlow.Infrastructure.Services;

public class EmailComplianceService : IEmailComplianceService
{
    private readonly CollectFlowDbContext _db;
    private readonly IConfiguration _configuration;

    public EmailComplianceService(
        CollectFlowDbContext db,
        IConfiguration configuration)
    {
        _db = db;
        _configuration = configuration;
    }

    public async Task<bool> IsSuppressedAsync(
        string email,
        CancellationToken cancellationToken = default)
    {
        var normalized = Normalize(email);

        return await _db.EmailSuppressions
            .AnyAsync(x => x.Email == normalized, cancellationToken);
    }

    public async Task<string> CreateUnsubscribeUrlAsync(
        string email,
        CancellationToken cancellationToken = default)
    {
        var normalized = Normalize(email);

        var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(48))
            .Replace("+", "-")
            .Replace("/", "_")
            .Replace("=", "");

        _db.EmailUnsubscribeTokens.Add(new EmailUnsubscribeToken
        {
            Email = normalized,
            Token = token,
            ExpiresAtUtc = DateTime.UtcNow.AddYears(2)
        });

        await _db.SaveChangesAsync(cancellationToken);

        var publicBaseUrl =
            _configuration["App:PublicBaseUrl"]?.TrimEnd('/') ??
            "https://collectflowai.com";

        return $"{publicBaseUrl}/unsubscribe?token={Uri.EscapeDataString(token)}";
    }

    public async Task<bool> UnsubscribeAsync(
        string token,
        CancellationToken cancellationToken = default)
    {
        var record = await _db.EmailUnsubscribeTokens
            .FirstOrDefaultAsync(x =>
                x.Token == token &&
                x.UsedAtUtc == null &&
                x.ExpiresAtUtc > DateTime.UtcNow,
                cancellationToken);

        if (record is null)
            return false;

        record.UsedAtUtc = DateTime.UtcNow;

        await AddSuppressionAsync(
            record.Email,
            SuppressionReason.Unsubscribed,
            "unsubscribe-link",
            cancellationToken);

        await _db.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task AddSuppressionAsync(
        string email,
        SuppressionReason reason,
        string source,
        CancellationToken cancellationToken = default)
    {
        var normalized = Normalize(email);

        var existing = await _db.EmailSuppressions
            .FirstOrDefaultAsync(x => x.Email == normalized, cancellationToken);

        if (existing is not null)
        {
            existing.Reason = reason;
            existing.Source = source;
            existing.UpdatedAtUtc = DateTime.UtcNow;
            return;
        }

        _db.EmailSuppressions.Add(new EmailSuppression
        {
            Email = normalized,
            Reason = reason,
            Source = source
        });

        await _db.SaveChangesAsync(cancellationToken);
    }

    private static string Normalize(string email)
    {
        return email.Trim().ToLowerInvariant();
    }
}