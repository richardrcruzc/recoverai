namespace CollectFlow.Application.DTOs.EmailAutomation;

public class QueueLeadBatchResponse
{
    public int Evaluated { get; set; }
    public int Queued { get; set; }
    public int Skipped { get; set; }
}