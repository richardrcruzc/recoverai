using System.ComponentModel.DataAnnotations;

namespace CollectFlow.Api.DTOs.Auth;

public class LoginResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public DateTime ExpiresAtUtc { get; set; }
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = "Admin";
    public Guid TenantId { get; set; }
}