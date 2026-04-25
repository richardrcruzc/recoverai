using CollectFlow.Application.DTOs.Reports;
using CollectFlow.Application.Interfaces;
using CollectFlow.Domain.Enums;
using CollectFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CollectFlow.Infrastructure.Services;

public class ReportService : IReportService
{
    private readonly CollectFlowDbContext _db;

    public ReportService(CollectFlowDbContext db)
    {
        _db = db;
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