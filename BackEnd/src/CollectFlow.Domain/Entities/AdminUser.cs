using CollectFlow.Domain.Enums;

namespace CollectFlow.Domain.Entities;

public class AdminUser : BaseEntity
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public AdminUserRole Role { get; set; } = AdminUserRole.Admin;
    public bool IsActive { get; set; } = true;
    public DateTime? LastLoginAtUtc { get; set; }
}
