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

        var adminEmail = "admin@recoverai.net";

        var adminExists = await dbContext.AdminUsers.AnyAsync(x => x.Email == adminEmail);
        if (adminExists)
            return;

        var admin = new AdminUser
        {
            FullName = "RecoverAI Admin",
            Email = adminEmail,
            Role = AdminUserRole.Admin,
            IsActive = true
        };

        admin.PasswordHash = passwordHasher.HashPassword(admin, "admin123");

        dbContext.AdminUsers.Add(admin);
        await dbContext.SaveChangesAsync();
    }
}
