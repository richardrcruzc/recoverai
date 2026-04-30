namespace CollectFlow.Application.DTOs.Reports;

public class SalesFunnelResponse
{
    public int Leads { get; set; }
    public int Contacted { get; set; }
    public int Replied { get; set; }
    public int DemoScheduled { get; set; }
    public int Activated { get; set; }
    public int PayingCustomers { get; set; }

    public int EmailsSent { get; set; }

    public decimal TotalRecovered { get; set; }
    public decimal TotalFees { get; set; }

    public double ReplyRate { get; set; }
    public double DemoRate { get; set; }
    public double ActivationRate { get; set; }
    public double ConversionRate { get; set; }
}