using CollectFlow.Application.DTOs.Billing;
using CollectFlow.Application.Interfaces;
using CollectFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CollectFlow.Infrastructure.Services;

public class BillingService : IBillingService
{
    private readonly CollectFlowDbContext _db;

    public BillingService(CollectFlowDbContext db)
    {
        _db = db;
    }

    public async Task<BillingSummaryResponse> GetSummaryAsync(CancellationToken cancellationToken = default)
    {
        var fees = await _db.RecoveryFees
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        return new BillingSummaryResponse
        {
            TotalRecovered = fees.Sum(x => x.RecoveredAmount),
            TotalFees = fees.Sum(x => x.FeeAmount),
            UnbilledFees = fees.Where(x => !x.IsBilled).Sum(x => x.FeeAmount),
            FeeRate = 0.03m,
            FeeCount = fees.Count
        };
    }
}