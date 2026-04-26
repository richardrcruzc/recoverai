using CollectFlow.Domain.Enums;

namespace CollectFlow.Application.DTOs.Plans;

public class PlanLimitsResponse
{
    public PlanType Plan { get; set; }
    public bool IsActive { get; set; }

    public int CustomerLimit { get; set; }
    public int InvoiceLimit { get; set; }
    public int ReminderRunLimit { get; set; }
    public int ScoringRunLimit { get; set; }

    public int CustomerCount { get; set; }
    public int InvoiceCount { get; set; }
    public int ReminderRunCount { get; set; }
    public int ScoringRunCount { get; set; }

    public bool CanCreateCustomer { get; set; }
    public bool CanCreateInvoice { get; set; }
    public bool CanRunReminders { get; set; }
    public bool CanRunScoring { get; set; }
}