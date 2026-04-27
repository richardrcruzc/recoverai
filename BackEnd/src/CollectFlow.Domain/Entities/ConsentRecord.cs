namespace CollectFlow.Domain.Entities;

public class ConsentRecord : BaseEntity
{
    public Guid TenantId { get; set; }
    public Tenant Tenant { get; set; } = default!;

    public Guid? AdminUserId { get; set; }
    public AdminUser? AdminUser { get; set; }

    public string ConsentType { get; set; } = string.Empty;
    public string Version { get; set; } = "1.0";
    public string IpAddress { get; set; } = string.Empty;
    public string UserAgent { get; set; } = string.Empty;
    public DateTime ConsentedAtUtc { get; set; } = DateTime.UtcNow;
}