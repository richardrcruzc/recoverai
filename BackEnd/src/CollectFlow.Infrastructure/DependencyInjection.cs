using CollectFlow.Application.Interfaces;
using CollectFlow.Domain.Entities;
using CollectFlow.Infrastructure.Options;
using CollectFlow.Infrastructure.Persistence;
using CollectFlow.Infrastructure.Services;
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

        services.AddDbContext<CollectFlowDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IEmailService, SmtpEmailService>();
        services.AddScoped<ILeadService, LeadService>();

        services.AddScoped<IAdminUserService, AdminUserService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<PasswordHasher<AdminUser>>();
        services.AddScoped<ICustomerService, CustomerService>();
        services.AddScoped<IInvoiceService, InvoiceService>();

        return services;
    }
}
