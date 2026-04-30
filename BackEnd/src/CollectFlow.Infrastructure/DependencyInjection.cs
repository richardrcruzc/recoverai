using CollectFlow.Application.Interfaces;
using CollectFlow.Domain.Entities;
using CollectFlow.Infrastructure.Options;
using CollectFlow.Infrastructure.Persistence;
using CollectFlow.Infrastructure.Services;
using CollectFlow.Infrastructure.Tenancy;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace CollectFlow.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<EmailOptions>(
    configuration.GetSection(EmailOptions.SectionName).Bind);

        services.AddScoped<TenantContext>();
        services.AddDbContext<CollectFlowDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IEmailService, SmtpEmailService>();
        services.AddScoped<ILeadService, LeadService>();

        services.AddScoped<IAdminUserService, AdminUserService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<PasswordHasher<AdminUser>>();
        services.AddScoped<ICustomerService, CustomerService>();
        services.AddScoped<IInvoiceService, InvoiceService>();
        services.AddScoped<IReminderService, ReminderService>();
        services.AddScoped<IPaymentService, PaymentService>();
        services.AddScoped<IReportsService, ReportsService>();
        services.AddScoped<IScoringService, ScoringService>();
        services.AddScoped<IBillingService, BillingService>();
        services.AddScoped<IPlanLimitService, PlanLimitService>();
        services.AddScoped<IEmailAutomationService, EmailAutomationService>();
        services.AddScoped<ICollectionsEngineService, CollectionsEngineService>();
        services.AddScoped<ISendGridOutboundService, SendGridOutboundService>();
        services.AddScoped<IOutboundEmailService, OutboundEmailService>();
        services.AddScoped<IOutboundQueryService, OutboundQueryService>();
        services.AddScoped<ITenantJobRunner, TenantJobRunner>();
        services.AddScoped<ILeadScrapingService, LeadScrapingService>();

        services.AddHttpClient("LeadScraper", client =>
        {
            client.Timeout = TimeSpan.FromSeconds(15);
            client.DefaultRequestHeaders.UserAgent.ParseAdd(
                "CollectFlowAI-LeadResearchBot/1.0 (+https://CollectFlowAI.com)");
        });
        services.AddScoped<IInvoiceImportService, InvoiceImportService>();
        services.AddScoped<ILeadImportService, LeadImportService>();
        services.AddScoped<IEmailComplianceService, EmailComplianceService>();
        services.AddScoped<ILeadPipelineService, LeadPipelineService>();

        return services;
    }
}
