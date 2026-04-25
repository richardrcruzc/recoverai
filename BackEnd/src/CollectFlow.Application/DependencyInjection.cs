using CollectFlow.Application.Interfaces;
using CollectFlow.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace CollectFlow.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<ILeadService, LeadService>();
        return services;
    }
}
