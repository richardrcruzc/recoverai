namespace CollectFlow.Application.DTOs.Onboarding;

public class TenantOnboardingResponse
{
    public Guid TenantId { get; set; }
    public string TenantName { get; set; } = string.Empty;
    public string AdminEmail { get; set; } = string.Empty;
}