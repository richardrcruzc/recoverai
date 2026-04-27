namespace CollectFlow.Application.DTOs.LeadScraping;

public class RunLeadScrapeRequest
{
    public string SourceName { get; set; } = "ManualWebSearch";
    public string SearchQuery { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public int Limit { get; set; } = 25;
}