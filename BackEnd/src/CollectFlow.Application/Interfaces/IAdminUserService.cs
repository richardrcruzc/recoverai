using CollectFlow.Application.DTOs.AdminUsers;

namespace CollectFlow.Application.Interfaces;

public interface IAdminUserService
{
    Task<IReadOnlyList<AdminUserResponse>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<AdminUserResponse> CreateAsync(CreateAdminUserRequest request, CancellationToken cancellationToken = default);
    Task<bool> SetActiveAsync(Guid id, bool isActive, CancellationToken cancellationToken = default);
}
