using System.ComponentModel.DataAnnotations;
using CollectFlow.Domain.Enums;

namespace CollectFlow.Application.DTOs.AdminUsers;

public class CreateAdminUserRequest
{
    [Required]
    [MaxLength(150)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(256)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    [MaxLength(100)]
    public string Password { get; set; } = string.Empty;

    public AdminUserRole Role { get; set; } = AdminUserRole.Viewer;
}
