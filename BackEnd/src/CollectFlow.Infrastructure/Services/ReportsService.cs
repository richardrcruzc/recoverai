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
        var contacted = await _db.Leads.CountAsync(x => x.Stage=="Contacted", ct);
        var replied = await _db.Leads.CountAsync(x => x.Stage =="Replied", ct);
        var demos = await _db.Leads.CountAsync(x => x.Stage =="DemoScheduled", ct);
        var activated = await _db.Leads.CountAsync(x => x.Stage =="Activated", ct);
        var paying = await _db.Leads.CountAsync(x => x.Stage =="PayingCustomer", ct);

        var totalRecovered = await _db.Payments.SumAsync(x => (decimal?)x.Amount) ?? 0;

        var totalFees = await _db.RevenueEvents
            .Where(x => x.EventType == "RecoveryFee")
            .SumAsync(x => (decimal?)x.Amount) ?? 0;

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

            ReplyRate = leads == 0 ? 0 : (double)replied / leads,
            DemoRate = replied == 0 ? 0 : (double)demos / replied,
            ActivationRate = demos == 0 ? 0 : (double)activated / demos,
            ConversionRate = leads == 0 ? 0 : (double)paying / leads
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
}