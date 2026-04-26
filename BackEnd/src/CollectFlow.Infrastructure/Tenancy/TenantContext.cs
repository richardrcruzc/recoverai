namespace CollectFlow.Infrastructure.Tenancy;

public class TenantContext
{
    public Guid? TenantId { get; private set; }

    public bool HasTenant => TenantId.HasValue && TenantId.Value != Guid.Empty;

    public void SetTenant(Guid tenantId)
    {
        TenantId = tenantId;
    }

    public Guid RequireTenantId()
    {
        if (!HasTenant)
            throw new InvalidOperationException("Tenant context is not available.");

        return TenantId!.Value;
    }
}