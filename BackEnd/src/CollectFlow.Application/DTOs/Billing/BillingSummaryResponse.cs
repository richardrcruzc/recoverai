namespace CollectFlow.Application.DTOs.Billing;

public class BillingSummaryResponse
{
    public decimal TotalRecovered { get; set; }
    public decimal TotalFees { get; set; }
    public decimal UnbilledFees { get; set; }
    public decimal FeeRate { get; set; }
    public int FeeCount { get; set; }
}