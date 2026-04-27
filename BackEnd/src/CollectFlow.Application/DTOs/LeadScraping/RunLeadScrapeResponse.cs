namespace CollectFlow.Application.DTOs.LeadScraping;

public class RunLeadScrapeResponse
{
    public Guid JobId { get; set; }
    public int CompaniesFound { get; set; }
    public int ContactsCreated { get; set; }
    public int ContactsSkipped { get; set; }
}