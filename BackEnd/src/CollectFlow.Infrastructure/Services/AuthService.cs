using CollectFlow.Application.Interfaces;
using CollectFlow.Domain.Entities;
using CollectFlow.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CollectFlow.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly CollectFlowDbContext _dbContext;
    private readonly PasswordHasher<AdminUser> _passwordHasher;

    public AuthService(CollectFlowDbContext dbContext, PasswordHasher<AdminUser> passwordHasher)
    {
        _dbContext = dbContext;
        _passwordHasher = passwordHasher;
    }

    public async Task<(bool Success, string FullName, string Email, string Role, Guid TenantId)> ValidateCredentialsAsync(
        string email,
        string password,
        CancellationToken cancellationToken = default)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();

        var user = await _dbContext.AdminUsers
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(x => x.Email == normalizedEmail, cancellationToken);

        if (user is null || !user.IsActive)
            return (false, string.Empty, string.Empty, string.Empty, Guid.Empty);

        var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);

        if (result == PasswordVerificationResult.Failed)
            return (false, string.Empty, string.Empty, string.Empty, Guid.Empty);

        user.LastLoginAtUtc = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync(cancellationToken);

        return (true,user.FullName, user.Email, user.Role.ToString(), user.TenantId);
    }
}