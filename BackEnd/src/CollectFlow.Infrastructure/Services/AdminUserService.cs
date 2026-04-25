using CollectFlow.Application.DTOs.AdminUsers;
using CollectFlow.Application.Interfaces;
using CollectFlow.Domain.Entities;
using CollectFlow.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CollectFlow.Infrastructure.Services;

public class AdminUserService : IAdminUserService
{
    private readonly CollectFlowDbContext _dbContext;
    private readonly PasswordHasher<AdminUser> _passwordHasher;

    public AdminUserService(CollectFlowDbContext dbContext, PasswordHasher<AdminUser> passwordHasher)
    {
        _dbContext = dbContext;
        _passwordHasher = passwordHasher;
    }

    public async Task<IReadOnlyList<AdminUserResponse>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.AdminUsers
            .AsNoTracking()
            .OrderBy(x => x.FullName)
            .Select(x => new AdminUserResponse
            {
                Id = x.Id,
                FullName = x.FullName,
                Email = x.Email,
                Role = x.Role,
                IsActive = x.IsActive,
                CreatedAtUtc = x.CreatedAtUtc,
                LastLoginAtUtc = x.LastLoginAtUtc
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<AdminUserResponse> CreateAsync(CreateAdminUserRequest request, CancellationToken cancellationToken = default)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var exists = await _dbContext.AdminUsers.AnyAsync(x => x.Email == email, cancellationToken);
        if (exists)
            throw new InvalidOperationException("A user with this email already exists.");

        var user = new AdminUser
        {
            FullName = request.FullName.Trim(),
            Email = email,
            Role = request.Role,
            IsActive = true
        };

        user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

        _dbContext.AdminUsers.Add(user);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Map(user);
    }

    public async Task<bool> SetActiveAsync(Guid id, bool isActive, CancellationToken cancellationToken = default)
    {
        var user = await _dbContext.AdminUsers.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (user is null)
            return false;

        user.IsActive = isActive;
        user.UpdatedAtUtc = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static AdminUserResponse Map(AdminUser user) => new()
    {
        Id = user.Id,
        FullName = user.FullName,
        Email = user.Email,
        Role = user.Role,
        IsActive = user.IsActive,
        CreatedAtUtc = user.CreatedAtUtc,
        LastLoginAtUtc = user.LastLoginAtUtc
    };
}
