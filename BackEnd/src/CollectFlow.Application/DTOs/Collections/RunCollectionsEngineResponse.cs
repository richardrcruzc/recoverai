namespace CollectFlow.Application.DTOs.Collections;

public class RunCollectionsEngineResponse
{
    public int EvaluatedInvoices { get; set; }
    public int EmailsSent { get; set; }
    public int CallTasksCreated { get; set; }
    public int Skipped { get; set; }
    public int Failed { get; set; }
    public int ActionsCreated { get; set; }
}