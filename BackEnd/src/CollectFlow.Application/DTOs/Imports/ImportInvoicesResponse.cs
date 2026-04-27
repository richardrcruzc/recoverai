namespace CollectFlow.Application.DTOs.Imports;

public class ImportInvoicesResponse
{
    public int RowsRead { get; set; }
    public int CustomersCreated { get; set; }
    public int InvoicesCreated { get; set; }
    public int RowsSkipped { get; set; }
    public List<string> Errors { get; set; } = new();
}