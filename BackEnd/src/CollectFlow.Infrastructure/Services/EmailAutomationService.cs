using CollectFlow.Application.DTOs.EmailAutomation;
using CollectFlow.Application.Interfaces;
using CollectFlow.Domain.Entities;
using CollectFlow.Domain.Enums;
using CollectFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CollectFlow.Infrastructure.Services;

public class EmailAutomationService : IEmailAutomationService
{
    private readonly CollectFlowDbContext _db;
    private readonly IEmailService _emailService;

    public EmailAutomationService(
        CollectFlowDbContext db,
        IEmailService emailService)
    {
        _db = db;
        _emailService = emailService;
    }
    public async Task<int> SendLeadCampaignAsync(
    string campaignKey,
    string subject,
    Func<Lead, string> bodyBuilder,
    CancellationToken ct = default)
    {
        var leads = await _db.Leads
            .Where(x => !string.IsNullOrWhiteSpace(x.Email))
            .ToListAsync(ct);

        int sent = 0;

        foreach (var lead in leads)
        {
            try
            {
                var body = bodyBuilder(lead);

                await _emailService.SendAsync(
                    lead.Email!,
                    subject,
                    body,
                    ct);

                sent++;
            }
            catch
            {
                // optionally log per-lead failure
            }
        }

        return sent;
    }
    public async Task QueueLeadSequenceAsync(Guid leadId, CancellationToken cancellationToken = default)
    {
        var lead = await _db.Leads
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(x => x.Id == leadId, cancellationToken);

        if (lead is null || string.IsNullOrWhiteSpace(lead.Email))
            return;

        var alreadyQueued = await _db.EmailAutomationJobs
            .IgnoreQueryFilters()
            .AnyAsync(x => x.LeadId == leadId && x.CampaignKey.StartsWith("lead-nurture"), cancellationToken);

        if (alreadyQueued)
            return;

        var now = DateTime.UtcNow;

        var jobs = new[]
        {
            BuildLeadJob(lead, "lead-nurture-day-0", now),
            BuildLeadJob(lead, "lead-nurture-day-2", now.AddDays(2)),
            BuildLeadJob(lead, "lead-nurture-day-5", now.AddDays(5))
        };

        _db.EmailAutomationJobs.AddRange(jobs);
        await _db.SaveChangesAsync(cancellationToken);
    }

    public async Task<RunEmailAutomationResponse> RunDueJobsAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;

        var jobs = await _db.EmailAutomationJobs
            .Where(x =>
                x.Status == EmailAutomationStatus.Pending &&
                x.ScheduledForUtc <= now)
            .OrderBy(x => x.ScheduledForUtc)
            .Take(50)
            .ToListAsync(cancellationToken);

        var response = new RunEmailAutomationResponse
        {
            EvaluatedJobs = jobs.Count
        };

        foreach (var job in jobs)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(job.RecipientEmail))
                {
                    job.Status = EmailAutomationStatus.Skipped;
                    job.ErrorMessage = "Recipient email missing.";
                    response.Skipped++;
                    continue;
                }

                await _emailService.SendAsync(
                    job.RecipientEmail,
                    job.Subject,
                    job.BodyHtml,
                    cancellationToken);

                job.Status = EmailAutomationStatus.Sent;
                job.SentAtUtc = DateTime.UtcNow;
                response.Sent++;
            }
            catch (Exception ex)
            {
                job.Status = EmailAutomationStatus.Failed;
                job.ErrorMessage = ex.Message;
                response.Failed++;
            }
        }

        await _db.SaveChangesAsync(cancellationToken);
        return response;
    }

    public async Task<IReadOnlyList<EmailAutomationJobResponse>> GetJobsAsync(
        CancellationToken cancellationToken = default)
    {
        return await _db.EmailAutomationJobs
            .AsNoTracking()
            .OrderByDescending(x => x.CreatedAtUtc)
            .Select(x => new EmailAutomationJobResponse
            {
                Id = x.Id,
                TenantId = x.TenantId,
                LeadId = x.LeadId,
                CampaignKey = x.CampaignKey,
                RecipientEmail = x.RecipientEmail,
                RecipientName = x.RecipientName,
                Subject = x.Subject,
                ScheduledForUtc = x.ScheduledForUtc,
                SentAtUtc = x.SentAtUtc,
                Status = x.Status,
                ErrorMessage = x.ErrorMessage
            })
            .ToListAsync(cancellationToken);
    }

    private static EmailAutomationJob BuildLeadJob(Lead lead, string campaignKey, DateTime scheduledForUtc)
    {
        var subject = campaignKey switch
        {
            "lead-nurture-day-0" => "Your unpaid invoices are waiting",
            "lead-nurture-day-2" => "Most businesses lose money through inconsistent follow-up",
            "lead-nurture-day-5" => "Still chasing invoices manually?",
            _ => "RecoverAI follow-up"
        };

        var body = campaignKey switch
        {
            "lead-nurture-day-0" => $@"
                <h2>Thanks for checking out RecoverAI</h2>
                <p>Hi {lead.Name},</p>
                <p>Most businesses do not have a collections problem. They have a follow-up problem.</p>
                <p>RecoverAI helps you prioritize overdue invoices, automate reminders, and track recovered payments.</p>
                <p><a href=""https://recoverai.net/demo"">Try the demo</a></p>",

            "lead-nurture-day-2" => $@"
                <h2>Invoice follow-up should not depend on memory</h2>
                <p>Hi {lead.Name},</p>
                <p>Late invoices often stay unpaid because follow-ups are inconsistent or uncomfortable.</p>
                <p>RecoverAI gives you an AI priority queue and automated reminder workflow.</p>
                <p><a href=""https://recoverai.net/onboarding"">Create your workspace</a></p>",

            "lead-nurture-day-5" => $@"
                <h2>Every overdue invoice has a next best action</h2>
                <p>Hi {lead.Name},</p>
                <p>RecoverAI shows who to follow up with first, what is overdue, and how much is recoverable.</p>
                <p><a href=""https://recoverai.net/onboarding"">Start setup</a></p>",

            _ => "<p>RecoverAI follow-up</p>"
        };

        return new EmailAutomationJob
        {
            TenantId = null,
            LeadId = lead.Id,
            CampaignKey = campaignKey,
            RecipientEmail = lead.Email.Trim().ToLowerInvariant(),
            RecipientName = lead.Name,
            Subject = subject,
            BodyHtml = body,
            ScheduledForUtc = scheduledForUtc,
            Status = EmailAutomationStatus.Pending
        };
    }
}