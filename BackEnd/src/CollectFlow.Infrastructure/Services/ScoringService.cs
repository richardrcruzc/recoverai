using CollectFlow.Application.DTOs.Scoring;
using CollectFlow.Application.Interfaces;
using CollectFlow.Domain.Entities;
using CollectFlow.Domain.Enums;
using CollectFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CollectFlow.Infrastructure.Services;

public class ScoringService : IScoringService
{
    private readonly CollectFlowDbContext _db;

    public ScoringService(CollectFlowDbContext db)
    {
        _db = db;
    }

    public async Task<RunScoringResponse> RunAsync(CancellationToken cancellationToken = default)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var invoices = await _db.Invoices
            .Include(x => x.Customer)
            .Where(x => x.Balance > 0 && x.Status != InvoiceStatus.Paid)
            .ToListAsync(cancellationToken);

        var response = new RunScoringResponse
        {
            EvaluatedInvoices = invoices.Count
        };

        foreach (var invoice in invoices)
        {
            var daysOverdue = invoice.DueDate < today
                ? today.DayNumber - invoice.DueDate.DayNumber
                : 0;

            var reminderCount = await _db.ReminderLogs.CountAsync(
                x => x.InvoiceId == invoice.Id,
                cancellationToken);

            var paymentCount = await _db.Payments.CountAsync(
                x => x.InvoiceId == invoice.Id,
                cancellationToken);

            var score = CalculateScore(
                balance: invoice.Balance,
                daysOverdue: daysOverdue,
                reminderCount: reminderCount,
                paymentCount: paymentCount);

            var priority = GetPriority(score);

            var reason = BuildReason(
                invoice.Balance,
                daysOverdue,
                reminderCount,
                paymentCount,
                score,
                priority);

            var existing = await _db.InvoiceScores
                .FirstOrDefaultAsync(x => x.InvoiceId == invoice.Id, cancellationToken);

            if (existing is null)
            {
                var newScore = new InvoiceScore
                {
                    TenantId = invoice.TenantId,
                    InvoiceId = invoice.Id,
                    CustomerId = invoice.CustomerId,
                    Score = score,
                    Priority = priority,
                    DaysOverdue = daysOverdue,
                    Balance = invoice.Balance,
                    ReminderCount = reminderCount,
                    PaymentCount = paymentCount,
                    Reason = reason
                };

                _db.InvoiceScores.Add(newScore);
                response.ScoresCreated++;
            }
            else
            {
                existing.Score = score;
                existing.Priority = priority;
                existing.DaysOverdue = daysOverdue;
                existing.Balance = invoice.Balance;
                existing.ReminderCount = reminderCount;
                existing.PaymentCount = paymentCount;
                existing.Reason = reason;
                existing.UpdatedAtUtc = DateTime.UtcNow;

                response.ScoresUpdated++;
            }
        }

        await _db.SaveChangesAsync(cancellationToken);
        return response;
    }

    public async Task<IReadOnlyList<InvoiceScoreResponse>> GetScoresAsync(
        CancellationToken cancellationToken = default)
    {
        return await _db.InvoiceScores
            .AsNoTracking()
            .Include(x => x.Invoice)
            .Include(x => x.Customer)
            .OrderByDescending(x => x.Score)
            .ThenByDescending(x => x.Balance)
            .Select(x => new InvoiceScoreResponse
            {
                Id = x.Id,
                InvoiceId = x.InvoiceId,
                CustomerId = x.CustomerId,
                InvoiceNumber = x.Invoice.InvoiceNumber,
                CustomerName = x.Customer.Name,
                CustomerCompanyName = x.Customer.CompanyName,
                Score = x.Score,
                Priority = x.Priority,
                DaysOverdue = x.DaysOverdue,
                Balance = x.Balance,
                ReminderCount = x.ReminderCount,
                PaymentCount = x.PaymentCount,
                Reason = x.Reason,
                CreatedAtUtc = x.CreatedAtUtc,
                UpdatedAtUtc = x.UpdatedAtUtc
            })
            .ToListAsync(cancellationToken);
    }

    private static int CalculateScore(
        decimal balance,
        int daysOverdue,
        int reminderCount,
        int paymentCount)
    {
        var score = 0;

        if (daysOverdue > 0)
            score += Math.Min(daysOverdue, 60);

        if (balance >= 10000)
            score += 30;
        else if (balance >= 5000)
            score += 20;
        else if (balance >= 1000)
            score += 10;
        else
            score += 5;

        if (reminderCount >= 3)
            score += 15;
        else if (reminderCount >= 1)
            score += 5;

        if (paymentCount > 0)
            score -= 10;

        return Math.Clamp(score, 0, 100);
    }

    private static CollectionPriority GetPriority(int score)
    {
        if (score >= 80) return CollectionPriority.Critical;
        if (score >= 60) return CollectionPriority.High;
        if (score >= 35) return CollectionPriority.Medium;
        return CollectionPriority.Low;
    }

    private static string BuildReason(
        decimal balance,
        int daysOverdue,
        int reminderCount,
        int paymentCount,
        int score,
        CollectionPriority priority)
    {
        return
            $"Priority is {priority} with score {score}. " +
            $"Balance is {balance:C}. " +
            $"Invoice is {daysOverdue} days overdue. " +
            $"Reminder count is {reminderCount}. " +
            $"Payment count is {paymentCount}.";
    }
}