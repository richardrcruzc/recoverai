using CollectFlow.Api.Options;
using CollectFlow.Application.Interfaces;
using CollectFlow.Domain.Enums;
using CollectFlow.Infrastructure.Persistence;
using CollectFlow.Infrastructure.Tenancy;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Stripe;
using Stripe.Checkout;

namespace CollectFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BillingController : ControllerBase
{
    private readonly IBillingService _billingService;
    private readonly StripeOptions _stripeOptions;
    private readonly CollectFlowDbContext _db;
    private readonly TenantContext _tenantContext;

    public BillingController(
        IBillingService billingService,
        IOptions<StripeOptions> stripeOptions,
        CollectFlowDbContext db,
        TenantContext tenantContext)
    {
        _billingService = billingService;
        _stripeOptions = stripeOptions.Value;
        _db = db;
        _tenantContext = tenantContext;
    }
    [HttpPost("create-checkout-session")]
    public async Task<IActionResult> CreateCheckoutSession(CancellationToken cancellationToken)
    {
        var tenantId = _tenantContext.RequireTenantId();

        var subscription = await _db.TenantSubscriptions
            .FirstOrDefaultAsync(x => x.TenantId == tenantId, cancellationToken);

        if (subscription is null)
        {
            return BadRequest(new { message = "Subscription record not found." });
        }

        var options = new SessionCreateOptions
        {
            Mode = "subscription",
            SuccessUrl = _stripeOptions.SuccessUrl,
            CancelUrl = _stripeOptions.CancelUrl,
            ClientReferenceId = tenantId.ToString(),
            Metadata = new Dictionary<string, string>
            {
                ["tenantId"] = tenantId.ToString()
            },
            LineItems = new List<SessionLineItemOptions>
        {
            new()
            {
                Price = _stripeOptions.ProPriceId,
                Quantity = 1
            }
        }
        };

        if (!string.IsNullOrWhiteSpace(subscription.StripeCustomerId))
        {
            options.Customer = subscription.StripeCustomerId;
        }

        var service = new SessionService();
        var session = await service.CreateAsync(options, cancellationToken: cancellationToken);

        return Ok(new { url = session.Url });
    }
    [HttpPost("webhook")]
    [AllowAnonymous]
    public async Task<IActionResult> StripeWebhook(CancellationToken cancellationToken)
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync(cancellationToken);

        Event stripeEvent;

        try
        {
            stripeEvent = EventUtility.ConstructEvent(
                json,
                Request.Headers["Stripe-Signature"],
                _stripeOptions.WebhookSecret);
        }
        catch
        {
            return BadRequest();
        }

        if (stripeEvent.Type == Events.CheckoutSessionCompleted)
        {
            var session = stripeEvent.Data.Object as Session;

            if (session?.Metadata != null &&
                session.Metadata.TryGetValue("tenantId", out var tenantIdText) &&
                Guid.TryParse(tenantIdText, out var tenantId))
            {
                var subscription = await _db.TenantSubscriptions
                    .IgnoreQueryFilters()
                    .FirstOrDefaultAsync(x => x.TenantId == tenantId, cancellationToken);

                if (subscription != null)
                {
                    subscription.Plan = PlanType.Pro;
                    subscription.IsActive = true;
                    subscription.StripeCustomerId = session.CustomerId ?? subscription.StripeCustomerId;
                    subscription.StripeSubscriptionId = session.SubscriptionId ?? subscription.StripeSubscriptionId;
                    subscription.UpdatedAtUtc = DateTime.UtcNow;

                    await _db.SaveChangesAsync(cancellationToken);
                }
            }
        }

        if (stripeEvent.Type == Events.CustomerSubscriptionDeleted)
        {
            var stripeSub = stripeEvent.Data.Object as Subscription;

            if (stripeSub != null)
            {
                var subscription = await _db.TenantSubscriptions
                    .IgnoreQueryFilters()
                    .FirstOrDefaultAsync(x => x.StripeSubscriptionId == stripeSub.Id, cancellationToken);

                if (subscription != null)
                {
                    subscription.Plan = PlanType.Free;
                    subscription.IsActive = false;
                    subscription.UpdatedAtUtc = DateTime.UtcNow;

                    await _db.SaveChangesAsync(cancellationToken);
                }
            }
        }

        return Ok();
    }
    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary(CancellationToken cancellationToken)
    {
        var result = await _billingService.GetSummaryAsync(cancellationToken);
        return Ok(result);
    }
}