namespace CollectFlow.Application.DTOs.EmailAutomation;

public class QueueLeadBatchRequest
{
    public int BatchSize { get; set; } = 50;
}