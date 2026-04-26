using CollectFlow.Application.DTOs.Collections;
using CollectFlow.Application.Interfaces;
using CollectFlow.Domain.Entities;
using CollectFlow.Domain.Enums;
using CollectFlow.Infrastructure.Persistence;
using CollectFlow.Infrastructure.Tenancy;
using Microsoft.EntityFrameworkCore;

namespace CollectFlow.Infrastructure.Services;

public class CollectionsEngineService : ICollectionsEngineService
{
    private readonly CollectFlowDbContext _db;
    private readonly IEmailService _emailService;
    private readonly TenantContext _tenantContext;

    public CollectionsEngineService(
        CollectFlowDbContext db,
        IEmailService emailService,
        TenantContext tenantContext)
    {
        _db = db;
        _emailService = emailService;
        _tenantContext = tenantContext;
    }

    public async Task<RunCollectionsEngineResponse> RunAsync(
        CancellationToken cancellationToken = default)
    {
        var tenantId = _tenantContext.RequireTenantId();
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var invoices = await _db.Invoices
            .Include(x => x.Customer)
            .Where(x =>
                x.Balance > 0 &&
                x.Status != InvoiceStatus.Paid)
            .ToListAsync(cancellationToken);

        var response = new RunCollectionsEngineResponse
        {
            EvaluatedInvoices = invoices.Count
        };

        foreach (var invoice in invoices)
        {
            try
            {
                var daysOverdue = invoice.DueDate < today
                    ? today.DayNumber - invoice.DueDate.DayNumber
                    : 0;

                var reminderCount = await _db.ReminderLogs
                    .CountAsync(x => x.InvoiceId == invoice.Id, cancellationToken);

                var paymentCount = await _db.Payments
                    .CountAsync(x => x.InvoiceId == invoice.Id, cancellationToken);

                var existingActionToday = await _db.CollectionActions.AnyAsync(x =>
                    x.InvoiceId == invoice.Id &&
                    x.CreatedAtUtc.Date == DateTime.UtcNow.Date,
                    cancellationToken);

                if (existingActionToday)
                {
                    response.Skipped++;
                    continue;
                }

                var decision = DecideAction(invoice, daysOverdue, reminderCount, paymentCount);

                if (decision.ActionType == CollectionActionType.Wait)
                {
                    response.Skipped++;
                    continue;
                }

                var action = new CollectionAction
                {
                    TenantId = tenantId,
                    InvoiceId = invoice.Id,
                    CustomerId = invoice.CustomerId,
                    ActionType = decision.ActionType,
                    Status = CollectionActionStatus.Pending,
                    Title = decision.Title,
                    Message = decision.Message,
                    Reason = decision.Reason,
                    ScheduledForUtc = DateTime.UtcNow
                };

                _db.CollectionActions.Add(action);
                response.ActionsCreated++;

                if (decision.ActionType is CollectionActionType.EmailReminder or CollectionActionType.FinalNotice)
                {
                    await SendEmailActionAsync(invoice, action, cancellationToken);
                    response.EmailsSent++;
                }
                else if (decision.ActionType is CollectionActionType.CallTask or CollectionActionType.EscalationReview)
                {
                    response.CallTasksCreated++;
                }
            }
            catch
            {
                response.Failed++;
            }
        }

        _db.RevenueEvents.Add(new RevenueEvent
        {
            TenantId = tenantId,
            EventType = "CollectionsEngineRun",
            Metadata = $"Evaluated={response.EvaluatedInvoices};Actions={response.ActionsCreated}"
        });

        await _db.SaveChangesAsync(cancellationToken);
        return response;
    }

    public async Task<IReadOnlyList<CollectionActionResponse>> GetActionsAsync(
        CancellationToken cancellationToken = default)
    {
        return await _db.CollectionActions
            .AsNoTracking()
            .Include(x => x.Invoice)
            .Include(x => x.Customer)
            .OrderByDescending(x => x.CreatedAtUtc)
            .Select(x => new CollectionActionResponse
            {
                Id = x.Id,
                InvoiceId = x.InvoiceId,
                CustomerId = x.CustomerId,
                InvoiceNumber = x.Invoice.InvoiceNumber,
                CustomerName = x.Customer.Name,
                CustomerEmail = x.Customer.Email,
                ActionType = x.ActionType,
                Status = x.Status,
                Title = x.Title,
                Message = x.Message,
                Reason = x.Reason,
                ScheduledForUtc = x.ScheduledForUtc,
                CompletedAtUtc = x.CompletedAtUtc,
                ErrorMessage = x.ErrorMessage
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> CompleteActionAsync(
        Guid actionId,
        CompleteCollectionActionRequest request,
        CancellationToken cancellationToken = default)
    {
        var action = await _db.CollectionActions
            .FirstOrDefaultAsync(x => x.Id == actionId, cancellationToken);

        if (action is null)
            return false;

        action.Status = CollectionActionStatus.Completed;
        action.CompletedAtUtc = DateTime.UtcNow;
        action.Message = string.IsNullOrWhiteSpace(request.Notes)
            ? action.Message
            : $"{action.Message}\n\nNotes: {request.Notes}";
        action.UpdatedAtUtc = DateTime.UtcNow;

        await _db.SaveChangesAsync(cancellationToken);
        return true;
    }

    private async Task SendEmailActionAsync(
        Invoice invoice,
        CollectionAction action,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(invoice.Customer.Email))
        {
            action.Status = CollectionActionStatus.Failed;
            action.ErrorMessage = "Customer email missing.";
            return;
        }

        try
        {
            await _emailService.SendAsync(
                invoice.Customer.Email,
                action.Title,
                action.Message,
                cancellationToken);

            action.Status = CollectionActionStatus.Completed;
            action.CompletedAtUtc = DateTime.UtcNow;

            _db.ReminderLogs.Add(new ReminderLog
            {
                TenantId = invoice.TenantId,
                InvoiceId = invoice.Id,
                CustomerId = invoice.CustomerId,
                Channel = "Email",
                Subject = action.Title,
                Body = action.Message,
                Status = ReminderStatus.Sent,
                SentAtUtc = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            action.Status = CollectionActionStatus.Failed;
            action.ErrorMessage = ex.Message;
        }
    }

    private static CollectionDecision DecideAction(
        Invoice invoice,
        int daysOverdue,
        int reminderCount,
        int paymentCount)
    {
        if (invoice.Balance <= 0)
        {
            return CollectionDecision.Wait("Invoice has no open balance.");
        }

        if (daysOverdue <= 0)
        {
            return CollectionDecision.Email(
                "Upcoming invoice reminder",
                BuildPreDueEmail(invoice),
                "Invoice is not overdue yet. Send a friendly pre-due reminder.");
        }

        if (daysOverdue is >= 1 and <= 3 && reminderCount == 0)
        {
            return CollectionDecision.Email(
                $"Quick follow-up on invoice {invoice.InvoiceNumber}",
                BuildEarlyOverdueEmail(invoice, daysOverdue),
                "Invoice is recently overdue and no reminder has been sent.");
        }

        if (daysOverdue is >= 4 and <= 10 && reminderCount <= 1)
        {
            return CollectionDecision.Email(
                $"Invoice {invoice.InvoiceNumber} is overdue",
                BuildMediumOverdueEmail(invoice, daysOverdue),
                "Invoice is overdue and needs a direct reminder.");
        }

        if (daysOverdue is >= 11 and <= 20 && reminderCount <= 2)
        {
            return CollectionDecision.Call(
                $"Call recommended for invoice {invoice.InvoiceNumber}",
                BuildCallScript(invoice, daysOverdue),
                "Invoice is significantly overdue. A phone call is recommended.");
        }

        if (daysOverdue is >= 21 and <= 30 && reminderCount <= 3)
        {
            return CollectionDecision.FinalNotice(
                $"Final payment reminder for invoice {invoice.InvoiceNumber}",
                BuildFinalNoticeEmail(invoice, daysOverdue),
                "Invoice is over 21 days overdue. Send a final written reminder.");
        }

        if (daysOverdue > 30)
        {
            return CollectionDecision.Escalation(
                $"Escalation review for invoice {invoice.InvoiceNumber}",
                BuildEscalationMessage(invoice, daysOverdue),
                "Invoice is over 30 days overdue and should be reviewed for escalation.");
        }

        return CollectionDecision.Wait("No action required today.");
    }

    private static string BuildPreDueEmail(Invoice invoice)
    {
        return $@"
<p>Hi {invoice.Customer.Name},</p>
<p>This is a friendly reminder that invoice <strong>{invoice.InvoiceNumber}</strong> is coming due.</p>
<p><strong>Amount due:</strong> {invoice.Currency} {invoice.Balance:N2}</p>
<p><strong>Due date:</strong> {invoice.DueDate}</p>
<p>Please let us know if you need anything.</p>";
    }

    private static string BuildEarlyOverdueEmail(Invoice invoice, int daysOverdue)
    {
        return $@"
<p>Hi {invoice.Customer.Name},</p>
<p>Just following up on invoice <strong>{invoice.InvoiceNumber}</strong>, which appears to be {daysOverdue} day(s) overdue.</p>
<p><strong>Amount due:</strong> {invoice.Currency} {invoice.Balance:N2}</p>
<p>If payment is already in process, please disregard this message.</p>";
    }

    private static string BuildMediumOverdueEmail(Invoice invoice, int daysOverdue)
    {
        return $@"
<p>Hi {invoice.Customer.Name},</p>
<p>Invoice <strong>{invoice.InvoiceNumber}</strong> is now {daysOverdue} days overdue.</p>
<p><strong>Outstanding balance:</strong> {invoice.Currency} {invoice.Balance:N2}</p>
<p>Please confirm payment status or expected payment date.</p>";
    }

    private static string BuildFinalNoticeEmail(Invoice invoice, int daysOverdue)
    {
        return $@"
<p>Hi {invoice.Customer.Name},</p>
<p>This is a final reminder regarding invoice <strong>{invoice.InvoiceNumber}</strong>, currently {daysOverdue} days overdue.</p>
<p><strong>Outstanding balance:</strong> {invoice.Currency} {invoice.Balance:N2}</p>
<p>Please reply with payment status or contact us to discuss next steps.</p>";
    }

    private static string BuildCallScript(Invoice invoice, int daysOverdue)
    {
        return $@"
Call script:
Hi {invoice.Customer.Name}, this is a quick follow-up regarding invoice {invoice.InvoiceNumber}.
It appears to be {daysOverdue} days overdue with a balance of {invoice.Currency} {invoice.Balance:N2}.
Is there anything preventing payment, or can you confirm the expected payment date?";
    }

    private static string BuildEscalationMessage(Invoice invoice, int daysOverdue)
    {
        return $@"
Invoice {invoice.InvoiceNumber} is {daysOverdue} days overdue.
Outstanding balance: {invoice.Currency} {invoice.Balance:N2}.
Recommended action: review internally for escalation, payment plan, dispute handling, or external recovery process.";
    }

    private sealed class CollectionDecision
    {
        public CollectionActionType ActionType { get; init; }
        public string Title { get; init; } = string.Empty;
        public string Message { get; init; } = string.Empty;
        public string Reason { get; init; } = string.Empty;

        public static CollectionDecision Email(string title, string message, string reason) => new()
        {
            ActionType = CollectionActionType.EmailReminder,
            Title = title,
            Message = message,
            Reason = reason
        };

        public static CollectionDecision FinalNotice(string title, string message, string reason) => new()
        {
            ActionType = CollectionActionType.FinalNotice,
            Title = title,
            Message = message,
            Reason = reason
        };

        public static CollectionDecision Call(string title, string message, string reason) => new()
        {
            ActionType = CollectionActionType.CallTask,
            Title = title,
            Message = message,
            Reason = reason
        };

        public static CollectionDecision Escalation(string title, string message, string reason) => new()
        {
            ActionType = CollectionActionType.EscalationReview,
            Title = title,
            Message = message,
            Reason = reason
        };

        public static CollectionDecision Wait(string reason) => new()
        {
            ActionType = CollectionActionType.Wait,
            Title = "No action",
            Message = string.Empty,
            Reason = reason
        };
    }
}