namespace CollectFlow.Application.DTOs.Reports;

public class SalesFunnelDailyTrendResponse
{
    public DateOnly Date { get; set; }

    public int EmailsSent { get; set; }
    public int Replies { get; set; }
    public int DemosScheduled { get; set; }
    public int Activated { get; set; }
    public int PayingCustomers { get; set; }

    public double ReplyRate { get; set; }
}