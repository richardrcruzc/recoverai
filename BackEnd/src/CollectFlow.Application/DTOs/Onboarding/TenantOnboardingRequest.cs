using System.ComponentModel.DataAnnotations;

namespace CollectFlow.Application.DTOs.Onboarding;

public class TenantOnboardingRequest
{
    [Required]
    [MaxLength(200)]
    public string CompanyName { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string TenantSlug { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string AdminFullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(256)]
    public string AdminEmail { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    public string Password { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Industry { get; set; } = string.Empty;

    [MaxLength(100)]
    public string MonthlyInvoiceVolume { get; set; } = string.Empty;
}