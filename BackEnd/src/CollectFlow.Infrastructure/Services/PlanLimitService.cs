using CollectFlow.Application.Common;
using CollectFlow.Application.DTOs.Plans;
using CollectFlow.Application.Interfaces;
using CollectFlow.Domain.Entities;
using CollectFlow.Domain.Enums;
using CollectFlow.Infrastructure.Persistence;
using CollectFlow.Infrastructure.Tenancy;
using Microsoft.EntityFrameworkCore;

namespace CollectFlow.Infrastructure.Services;

public class PlanLimitService : IPlanLimitService
{
    private readonly CollectFlowDbContext _db;
    private readonly TenantContext _tenantContext;

    public PlanLimitService(CollectFlowDbContext db, TenantContext tenantContext)
    {
        _db = db;
        _tenantContext = tenantContext;
    }

    public async Task<PlanLimitsResponse> GetCurrentLimitsAsync(CancellationToken cancellationToken = default)
    {
        var tenantId = _tenantContext.RequireTenantId();

        var subscription = await GetOrCreateSubscriptionAsync(tenantId, cancellationToken);

        var customerCount = await _db.Customers.CountAsync(cancellationToken);
        var invoiceCount = await _db.Invoices.CountAsync(cancellationToken);

        var today = DateTime.UtcNow.Date;

        var reminderRunCount = await _db.RevenueEvents
            .CountAsync(x =>
                x.TenantId == tenantId &&
                x.EventType == "ReminderRun" &&
                x.CreatedAtUtc.Date == today,
                cancellationToken);

        var scoringRunCount = await _db.RevenueEvents
            .CountAsync(x =>
                x.TenantId == tenantId &&
                x.EventType == "ScoringRun" &&
                x.CreatedAtUtc.Date == today,
                cancellationToken);

        var limits = GetLimits(subscription.Plan);

        return new PlanLimitsResponse
        {
            Plan = subscription.Plan,
            IsActive = subscription.IsActive,

            CustomerLimit = limits.CustomerLimit,
            InvoiceLimit = limits.InvoiceLimit,
            ReminderRunLimit = limits.ReminderRunLimit,
            ScoringRunLimit = limits.ScoringRunLimit,

            CustomerCount = customerCount,
            InvoiceCount = invoiceCount,
            ReminderRunCount = reminderRunCount,
            ScoringRunCount = scoringRunCount,

            CanCreateCustomer = IsUnlimited(limits.CustomerLimit) || customerCount < limits.CustomerLimit,
            CanCreateInvoice = IsUnlimited(limits.InvoiceLimit) || invoiceCount < limits.InvoiceLimit,
            CanRunReminders = IsUnlimited(limits.ReminderRunLimit) || reminderRunCount < limits.ReminderRunLimit,
            CanRunScoring = IsUnlimited(limits.ScoringRunLimit) || scoringRunCount < limits.ScoringRunLimit
        };
    }

    public async Task EnsureCanCreateCustomerAsync(CancellationToken cancellationToken = default)
    {
        var limits = await GetCurrentLimitsAsync(cancellationToken);

        if (!limits.CanCreateCustomer)
        {
            throw new PaywallException(
                "customers",
                $"Free plan limit reached. You can create up to {limits.CustomerLimit} customers. Upgrade to Pro to continue.");
        }
    }

    public async Task EnsureCanCreateInvoiceAsync(CancellationToken cancellationToken = default)
    {
        var limits = await GetCurrentLimitsAsync(cancellationToken);

        if (!limits.CanCreateInvoice)
        {
            throw new PaywallException(
                "invoices",
                $"Free plan limit reached. You can create up to {limits.InvoiceLimit} invoices. Upgrade to Pro to continue.");
        }
    }

    public async Task EnsureCanRunRemindersAsync(CancellationToken cancellationToken = default)
    {
        var limits = await GetCurrentLimitsAsync(cancellationToken);

        if (!limits.CanRunReminders)
        {
            throw new PaywallException(
                "reminders",
                $"Free plan limit reached. You can run reminders {limits.ReminderRunLimit} time per day. Upgrade to Pro for automation.");
        }
    }

    public async Task EnsureCanRunScoringAsync(CancellationToken cancellationToken = default)
    {
        var limits = await GetCurrentLimitsAsync(cancellationToken);

        if (!limits.CanRunScoring)
        {
            throw new PaywallException(
                "scoring",
                $"Free plan limit reached. You can run scoring {limits.ScoringRunLimit} time per day. Upgrade to Pro for unlimited scoring.");
        }
    }

    private async Task<TenantSubscription> GetOrCreateSubscriptionAsync(
        Guid tenantId,
        CancellationToken cancellationToken)
    {
        var subscription = await _db.TenantSubscriptions
            .FirstOrDefaultAsync(x => x.TenantId == tenantId, cancellationToken);

        if (subscription is not null)
            return subscription;

        subscription = new TenantSubscription
        {
            TenantId = tenantId,
            Plan = PlanType.Free,
            IsActive = true
        };

        _db.TenantSubscriptions.Add(subscription);
        await _db.SaveChangesAsync(cancellationToken);

        return subscription;
    }

    private static PlanLimits GetLimits(PlanType plan)
    {
        return plan switch
        {
            PlanType.Pro => new PlanLimits
            {
                CustomerLimit = -1,
                InvoiceLimit = -1,
                ReminderRunLimit = -1,
                ScoringRunLimit = -1
            },

            PlanType.Enterprise => new PlanLimits
            {
                CustomerLimit = -1,
                InvoiceLimit = -1,
                ReminderRunLimit = -1,
                ScoringRunLimit = -1
            },

            _ => new PlanLimits
            {
                CustomerLimit = 5,
                InvoiceLimit = 10,
                ReminderRunLimit = 1,
                ScoringRunLimit = 1
            }
        };
    }

    private static bool IsUnlimited(int value) => value < 0;

    private sealed class PlanLimits
    {
        public int CustomerLimit { get; set; }
        public int InvoiceLimit { get; set; }
        public int ReminderRunLimit { get; set; }
        public int ScoringRunLimit { get; set; }
    }
}