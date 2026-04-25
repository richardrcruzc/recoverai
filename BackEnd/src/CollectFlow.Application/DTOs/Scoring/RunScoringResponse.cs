namespace CollectFlow.Application.DTOs.Scoring;

public class RunScoringResponse
{
    public int EvaluatedInvoices { get; set; }
    public int ScoresCreated { get; set; }
    public int ScoresUpdated { get; set; }
}