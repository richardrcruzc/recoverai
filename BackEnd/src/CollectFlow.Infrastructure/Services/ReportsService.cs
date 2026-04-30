using CollectFlow.Application.DTOs.Reports;
using CollectFlow.Application.Interfaces;
using CollectFlow.Domain.Enums;
using CollectFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Xml;

public class ReportsService : IReportsService
{
    private readonly CollectFlowDbContext _db;

    public ReportsService(CollectFlowDbContext db)
    {
        _db = db;
    }

    public async Task<SalesFunnelResponse> GetSalesFunnelAsync(CancellationToken ct)
    {
        var leads = await _db.Leads.CountAsync(ct);
        var contacted = await _db.Leads.CountAsync(x => x.Stage== LeadStage.Contacted, ct);
        var replied = await _db.Leads.CountAsync(x => x.Stage == LeadStage.Replied, ct);
        var demos = await _db.Leads.CountAsync(x => x.Stage == LeadStage.DemoScheduled, ct);
        var activated = await _db.Leads.CountAsync(x => x.Stage == LeadStage.Activated, ct);
        var paying = await _db.Leads.CountAsync(x => x.Stage == LeadStage.PayingCustomer, ct);

        var totalRecovered = await _db.Payments
     .SumAsync(x => (decimal?)x.Amount, ct) ?? 0;

        var totalFees = await _db.RecoveryFees
            .SumAsync(x => (decimal?)x.FeeAmount, ct) ?? 0;

        var emailsSent = await _db.EmailAutomationJobs
    .CountAsync(x => x.Status == EmailAutomationStatus.Sent, ct);

        //var replies = await _db.Leads
        //    .CountAsync(x => x.Stage >= LeadStage.Replied, ct);

       // var replyRate = emailsSent == 0 ? 0 : (double)replies / emailsSent;

        return new SalesFunnelResponse
        {
            Leads = leads,
            Contacted = contacted,
            Replied = replied,
            DemoScheduled = demos,
            Activated = activated,
            PayingCustomers = paying,
            TotalRecovered = totalRecovered,
            TotalFees = totalFees,

            ReplyRate = leads == 0 ? 0 : (double)replied / emailsSent,
            DemoRate = replied == 0 ? 0 : (double)demos / replied,
            ActivationRate = demos == 0 ? 0 : (double)activated / demos,
            ConversionRate = leads == 0 ? 0 : (double)paying / leads,
            
        };
    }
    public async Task<RecoverySummaryResponse> GetRecoverySummaryAsync(
     CancellationToken cancellationToken = default)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var invoices = await _db.Invoices.ToListAsync(cancellationToken);
        var payments = await _db.Payments.ToListAsync(cancellationToken);

        var totalInvoiced = invoices.Sum(x => x.Amount);
        var totalOutstanding = invoices.Sum(x => x.Balance);
        var totalCollected = payments.Sum(x => x.Amount);

        var overdueBalance = invoices
            .Where(x => x.Balance > 0 && x.DueDate < today)
            .Sum(x => x.Balance);

        var paidInvoices = invoices.Count(x => x.Status == InvoiceStatus.Paid);

        var overdueInvoices = invoices.Count(x =>
            x.Balance > 0 && x.DueDate < today);

        var collectionRate = totalInvoiced == 0
            ? 0
            : (totalCollected / totalInvoiced) * 100;

        return new RecoverySummaryResponse
        {
            TotalInvoiced = totalInvoiced,
            TotalOutstanding = totalOutstanding,
            TotalCollected = totalCollected,
            OverdueBalance = overdueBalance,
            PaidInvoices = paidInvoices,
            OverdueInvoices = overdueInvoices,
            CollectionRate = Math.Round(collectionRate, 2),
            TotalInvoices = invoices.Count,
            TotalPayments = payments.Count
        };
    } 
    public async Task<IReadOnlyList<SalesFunnelDailyTrendResponse>> GetSalesFunnelDailyTrendAsync(
    CancellationToken ct)
{
    var today = DateTime.UtcNow.Date;
    var start = today.AddDays(-6);

    var result = new List<SalesFunnelDailyTrendResponse>();

    for (var date = start; date <= today; date = date.AddDays(1))
    {
        var next = date.AddDays(1);
        var day = DateOnly.FromDateTime(date);

        var emailsSent = await _db.EmailAutomationJobs.CountAsync(x =>
            x.Status == EmailAutomationStatus.Sent &&
            x.SentAtUtc >= date &&
            x.SentAtUtc < next,
            ct);

        var replies = await _db.Leads.CountAsync(x =>
            x.Stage >= LeadStage.Replied &&
            x.LastRepliedAtUtc >= date &&
            x.LastRepliedAtUtc < next,
            ct);

        var demos = await _db.Leads.CountAsync(x =>
            x.Stage >= LeadStage.DemoScheduled &&
            x.UpdatedAtUtc >= date &&
            x.UpdatedAtUtc < next,
            ct);

        var activated = await _db.Leads.CountAsync(x =>
            x.Stage >= LeadStage.Activated &&
            x.UpdatedAtUtc >= date &&
            x.UpdatedAtUtc < next,
            ct);

        var paying = await _db.Leads.CountAsync(x =>
            x.Stage == LeadStage.PayingCustomer &&
            x.UpdatedAtUtc >= date &&
            x.UpdatedAtUtc < next,
            ct);

        result.Add(new SalesFunnelDailyTrendResponse
        {
            Date = day,
            EmailsSent = emailsSent,
            Replies = replies,
            DemosScheduled = demos,
            Activated = activated,
            PayingCustomers = paying,
            ReplyRate = emailsSent == 0 ? 0 : (double)replies / emailsSent
        });
    }

    return result;
}
}