using System.Text.RegularExpressions;
using CollectFlow.Application.DTOs.LeadScraping;
using CollectFlow.Application.Interfaces;
using CollectFlow.Domain.Entities;
using CollectFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CollectFlow.Infrastructure.Services;

public class LeadScrapingService : ILeadScrapingService
{
    private readonly CollectFlowDbContext _db;
    private readonly HttpClient _httpClient;

    public LeadScrapingService(
        CollectFlowDbContext db,
        IHttpClientFactory httpClientFactory)
    {
        _db = db;
        _httpClient = httpClientFactory.CreateClient("LeadScraper");
    }

    public async Task<RunLeadScrapeResponse> RunAsync(
        RunLeadScrapeRequest request,
        CancellationToken cancellationToken = default)
    {
        var job = new LeadSourceJob
        {
            SourceName = request.SourceName,
            SearchQuery = request.SearchQuery,
            Location = request.Location,
            Status = "Running"
        };

        _db.LeadSourceJobs.Add(job);
        await _db.SaveChangesAsync(cancellationToken);

        try
        {
            var companyUrls = ExtractUrlsFromInput(request.SearchQuery)
                .Take(request.Limit)
                .ToList();

            foreach (var url in companyUrls)
            {
                var result = await TryCreateContactFromWebsiteAsync(url, cancellationToken);

                if (result)
                    job.ContactsCreated++;
                else
                    job.ContactsSkipped++;

                job.CompaniesFound++;
            }

            job.Status = "Completed";
            await _db.SaveChangesAsync(cancellationToken);

            return new RunLeadScrapeResponse
            {
                JobId = job.Id,
                CompaniesFound = job.CompaniesFound,
                ContactsCreated = job.ContactsCreated,
                ContactsSkipped = job.ContactsSkipped
            };
        }
        catch (Exception ex)
        {
            job.Status = "Failed";
            job.ErrorMessage = ex.Message;
            await _db.SaveChangesAsync(cancellationToken);
            throw;
        }
    }

    private async Task<bool> TryCreateContactFromWebsiteAsync(
        string website,
        CancellationToken cancellationToken)
    {
        website = NormalizeUrl(website);

        var exists = await _db.OutboundContacts
            .AnyAsync(x => x.Website == website, cancellationToken);

        if (exists)
            return false;

        var html = await _httpClient.GetStringAsync(website, cancellationToken);

        var emails = ExtractEmails(html)
            .Where(IsLikelyBusinessEmail)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        var email = emails.FirstOrDefault();

        if (string.IsNullOrWhiteSpace(email))
            return false;

        var title = ExtractTitle(html);
        var companyName = string.IsNullOrWhiteSpace(title)
            ? GetDomainName(website)
            : title;

        var score = ScoreCompany(html, website, email);

        _db.OutboundContacts.Add(new OutboundContact
        {
            CompanyName = companyName,
            Website = website,
            Industry = GuessIndustry(html),
            ContactName = "",
            Title = "",
            Email = email.ToLowerInvariant(),
            LinkedInUrl = "",
            Score = score,
            Status = score >= 50 ? "Verified" : "NeedsReview",
            IsUnsubscribed = false
        });

        await _db.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static List<string> ExtractUrlsFromInput(string input)
    {
        var matches = Regex.Matches(input, @"https?://[^\s,;]+", RegexOptions.IgnoreCase);

        return matches
            .Select(x => x.Value.Trim().TrimEnd('.', ',', ';'))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();
    }

    private static string NormalizeUrl(string value)
    {
        value = value.Trim();

        if (!value.StartsWith("http://", StringComparison.OrdinalIgnoreCase) &&
            !value.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
        {
            value = "https://" + value;
        }

        return value.TrimEnd('/');
    }

    private static List<string> ExtractEmails(string html)
    {
        var matches = Regex.Matches(
            html,
            @"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}",
            RegexOptions.IgnoreCase);

        return matches.Select(x => x.Value).ToList();
    }

    private static bool IsLikelyBusinessEmail(string email)
    {
        var lower = email.ToLowerInvariant();

        if (lower.Contains("example.com")) return false;
        if (lower.Contains("domain.com")) return false;
        if (lower.Contains("sentry.io")) return false;
        if (lower.Contains("wixpress.com")) return false;

        return true;
    }

    private static string ExtractTitle(string html)
    {
        var match = Regex.Match(html, @"<title>\s*(.*?)\s*</title>", RegexOptions.IgnoreCase | RegexOptions.Singleline);

        if (!match.Success)
            return string.Empty;

        return Regex.Replace(match.Groups[1].Value, @"\s+", " ").Trim();
    }

    private static string GetDomainName(string website)
    {
        try
        {
            var uri = new Uri(website);
            return uri.Host.Replace("www.", "");
        }
        catch
        {
            return website;
        }
    }

    private static string GuessIndustry(string html)
    {
        var lower = html.ToLowerInvariant();

        if (lower.Contains("marketing") || lower.Contains("seo")) return "Marketing Agency";
        if (lower.Contains("managed it") || lower.Contains("cybersecurity")) return "IT Services";
        if (lower.Contains("bookkeeping") || lower.Contains("accounting")) return "Accounting";
        if (lower.Contains("consulting")) return "Consulting";
        if (lower.Contains("contractor")) return "Contractor";

        return "Service Business";
    }

    private static int ScoreCompany(string html, string website, string email)
    {
        var lower = html.ToLowerInvariant();
        var score = 0;

        if (lower.Contains("services")) score += 15;
        if (lower.Contains("clients")) score += 10;
        if (lower.Contains("monthly") || lower.Contains("retainer")) score += 15;
        if (lower.Contains("invoice") || lower.Contains("payment")) score += 20;
        if (lower.Contains("marketing") || lower.Contains("consulting") || lower.Contains("managed it")) score += 20;
        if (!email.StartsWith("info@", StringComparison.OrdinalIgnoreCase)) score += 10;

        return Math.Min(score, 100);
    }
}