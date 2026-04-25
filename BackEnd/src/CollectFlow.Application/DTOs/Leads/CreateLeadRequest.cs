using System.ComponentModel.DataAnnotations;

namespace CollectFlow.Application.DTOs.Leads;

public class CreateLeadRequest
{
    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(256)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Phone { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Company { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string InvoiceVolume { get; set; } = string.Empty;

    [Required]
    [MaxLength(2000)]
    public string BiggestProblem { get; set; } = string.Empty;
}
