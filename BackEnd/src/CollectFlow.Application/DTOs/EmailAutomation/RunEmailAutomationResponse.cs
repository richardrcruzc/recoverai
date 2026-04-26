namespace CollectFlow.Application.DTOs.EmailAutomation;

public class RunEmailAutomationResponse
{
    public int EvaluatedJobs { get; set; }
    public int Sent { get; set; }
    public int Failed { get; set; }
    public int Skipped { get; set; }
}