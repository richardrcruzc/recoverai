using System.ComponentModel.DataAnnotations;

namespace CollectFlow.Application.DTOs.Customers;

public class CreateCustomerRequest
{
    [Required]
    public Guid TenantId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(200)]
    public string CompanyName { get; set; } = string.Empty;

    [EmailAddress]
    [MaxLength(256)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string Notes { get; set; } = string.Empty;
}
