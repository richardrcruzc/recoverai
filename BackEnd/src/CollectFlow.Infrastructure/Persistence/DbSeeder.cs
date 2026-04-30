using CollectFlow.Domain.Entities;
using CollectFlow.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace CollectFlow.Infrastructure.Persistence;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();

        var dbContext = scope.ServiceProvider.GetRequiredService<CollectFlowDbContext>();
        var passwordHasher = scope.ServiceProvider.GetRequiredService<PasswordHasher<AdminUser>>();

        await dbContext.Database.MigrateAsync();

        var tenantSlug = "CollectFlowAI-demo";

        var tenant = await dbContext.Tenants
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(x => x.Slug == tenantSlug);
        if (tenant is null)
        {
            tenant = new Tenant
            {
                Name = "CollectFlowAI Demo",
                Slug = tenantSlug,
                IsActive = true
            };

            dbContext.Tenants.Add(tenant);
            await dbContext.SaveChangesAsync();
        }


        var adminEmail = "admin@CollectFlowAI.com";

        var adminExists = await dbContext.AdminUsers
            .IgnoreQueryFilters()
            .AnyAsync(x => x.Email == adminEmail);

        if (!adminExists)
        {
            var admin = new AdminUser
            {
                TenantId = tenant.Id,
                FullName = "CollectFlowAI Admin",
                Email = adminEmail,
                Role = AdminUserRole.Admin,
                IsActive = true
            };

            admin.PasswordHash = passwordHasher.HashPassword(admin, "admin123");

            dbContext.AdminUsers.Add(admin);
            await dbContext.SaveChangesAsync();
        }
    }
}
