namespace CollectFlow.Application.DTOs.Reminders;

public class RunReminderResponse
{
    public int EvaluatedInvoices { get; set; }
    public int RemindersCreated { get; set; }
    public int RemindersSent { get; set; }
    public int RemindersFailed { get; set; }
}