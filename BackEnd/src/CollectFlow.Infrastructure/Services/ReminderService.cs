using CollectFlow.Application.DTOs.Reminders;
using CollectFlow.Application.Interfaces;
using CollectFlow.Domain.Entities;
using CollectFlow.Domain.Enums;
using CollectFlow.Infrastructure.Persistence;
using CollectFlow.Infrastructure.Tenancy;
using Microsoft.EntityFrameworkCore;

namespace CollectFlow.Infrastructure.Services;

public class ReminderService : IReminderService
{
    private readonly CollectFlowDbContext _db;
    private readonly IEmailService _emailService;
    private readonly IPlanLimitService _planLimitService;
    private readonly TenantContext _tenantContext;
    public ReminderService(
        CollectFlowDbContext db,
        IEmailService emailService,
        IPlanLimitService planLimitService,
    TenantContext tenantContext)
    {
        _db = db;
        _emailService = emailService;
        _planLimitService = planLimitService;
        _tenantContext = tenantContext;
    }

    public async Task<RunReminderResponse> RunAsync(
        RunReminderRequest request,
        CancellationToken cancellationToken = default)
    {
        await _planLimitService.EnsureCanRunRemindersAsync(cancellationToken);

        var tenantId = _tenantContext.RequireTenantId();

        _db.RevenueEvents.Add(new RevenueEvent
        {
            TenantId = tenantId,
            EventType = "ReminderRun",
            Metadata = $"SendEmails={request.SendEmails}"
        });

        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var invoices = await _db.Invoices
            .Include(x => x.Customer)
            .Where(x =>
                x.Balance > 0 &&
                x.Status != InvoiceStatus.Paid &&
                x.DueDate < today)
            .ToListAsync(cancellationToken);

        var response = new RunReminderResponse
        {
            EvaluatedInvoices = invoices.Count
        };

        foreach (var invoice in invoices)
        {
            var daysOverdue = today.DayNumber - invoice.DueDate.DayNumber;

            if (daysOverdue < request.MinimumDaysOverdue)
                continue;

            var alreadySentToday = await _db.ReminderLogs.AnyAsync(x =>
                x.InvoiceId == invoice.Id &&
                x.CreatedAtUtc.Date == DateTime.UtcNow.Date &&
                x.Status == ReminderStatus.Sent,
                cancellationToken);

            if (alreadySentToday)
                continue;

            var subject = BuildSubject(invoice, daysOverdue);
            var body = BuildBody(invoice, daysOverdue);

            var log = new ReminderLog
            {
                TenantId = invoice.TenantId,
                InvoiceId = invoice.Id,
                CustomerId = invoice.CustomerId,
                Channel = "Email",
                Subject = subject,
                Body = body,
                Status = ReminderStatus.Pending
            };

            _db.ReminderLogs.Add(log);
            response.RemindersCreated++;

            if (!request.SendEmails)
            {
                log.Status = ReminderStatus.Skipped;
                continue;
            }

            try
            {
                if (string.IsNullOrWhiteSpace(invoice.Customer.Email))
                    throw new InvalidOperationException("Customer email is missing.");

                await _emailService.SendAsync(
                    invoice.Customer.Email,
                    subject,
                    body,
                    cancellationToken);

                log.Status = ReminderStatus.Sent;
                log.SentAtUtc = DateTime.UtcNow;
                response.RemindersSent++;
            }
            catch (Exception ex)
            {
                log.Status = ReminderStatus.Failed;
                log.ErrorMessage = ex.Message;
                response.RemindersFailed++;
            }
        }

        await _db.SaveChangesAsync(cancellationToken);

        return response;
    }

    public async Task<IReadOnlyList<ReminderLogResponse>> GetLogsAsync(
        CancellationToken cancellationToken = default)
    {
        return await _db.ReminderLogs
            .AsNoTracking()
            .Include(x => x.Invoice)
            .Include(x => x.Customer)
            .OrderByDescending(x => x.CreatedAtUtc)
            .Select(x => new ReminderLogResponse
            {
                Id = x.Id,
                InvoiceId = x.InvoiceId,
                CustomerId = x.CustomerId,
                CustomerName = x.Customer.Name,
                CustomerEmail = x.Customer.Email,
                InvoiceNumber = x.Invoice.InvoiceNumber,
                Channel = x.Channel,
                Subject = x.Subject,
                Status = x.Status,
                CreatedAtUtc = x.CreatedAtUtc,
                SentAtUtc = x.SentAtUtc,
                ErrorMessage = x.ErrorMessage
            })
            .ToListAsync(cancellationToken);
    }

    private static string BuildSubject(Invoice invoice, int daysOverdue)
    {
        return $"Payment reminder: Invoice {invoice.InvoiceNumber} is {daysOverdue} days overdue";
    }

    private static string BuildBody(Invoice invoice, int daysOverdue)
    {
        return $@"
            <h2>Payment Reminder</h2>
            <p>Hello {invoice.Customer.Name},</p>
            <p>This is a reminder that invoice <strong>{invoice.InvoiceNumber}</strong> is currently <strong>{daysOverdue} days overdue</strong>.</p>
            <p><strong>Amount Due:</strong> {invoice.Currency} {invoice.Balance:N2}</p>
            <p><strong>Due Date:</strong> {invoice.DueDate}</p>
            <p>Please submit payment at your earliest convenience.</p>
            <p>Thank you.</p>";
    }
}