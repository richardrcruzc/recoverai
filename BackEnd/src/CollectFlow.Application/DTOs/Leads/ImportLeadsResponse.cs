namespace CollectFlow.Application.DTOs.Leads;

public class ImportLeadsResponse
{
    public int TotalRows { get; set; }
    public int Imported { get; set; }
    public int Skipped { get; set; }
    public int Failed { get; set; }
    public List<string> Errors { get; set; } = new();
}