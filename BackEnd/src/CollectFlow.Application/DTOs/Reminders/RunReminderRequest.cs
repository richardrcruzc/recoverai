namespace CollectFlow.Application.DTOs.Reminders;

public class RunReminderRequest
{
    public int MinimumDaysOverdue { get; set; } = 1;
    public bool SendEmails { get; set; } = true;
}