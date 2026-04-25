namespace CollectFlow.Application.DTOs.Reports;

public class RecoverySummaryResponse
{
    public decimal TotalInvoiced { get; set; }
    public decimal TotalOutstanding { get; set; }
    public decimal TotalCollected { get; set; }
    public decimal OverdueBalance { get; set; }

    public int PaidInvoices { get; set; }
    public int OverdueInvoices { get; set; }

    public decimal CollectionRate { get; set; }

    public int TotalInvoices { get; set; }
    public int TotalPayments { get; set; }
}