namespace CollectFlow.Domain.Entities;

public class LeadSourceJob : BaseEntity
{
    public string SourceName { get; set; } = string.Empty;
    public string SourceUrl { get; set; } = string.Empty;
    public string SearchQuery { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;

    public int CompaniesFound { get; set; }
    public int ContactsCreated { get; set; }
    public int ContactsSkipped { get; set; }

    public string Status { get; set; } = "Pending";
    public string ErrorMessage { get; set; } = string.Empty;
}