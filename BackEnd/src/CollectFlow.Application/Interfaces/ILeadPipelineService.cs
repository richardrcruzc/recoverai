using CollectFlow.Domain.Enums;

public interface ILeadPipelineService
{
    Task<bool> UpdateStageAsync(Guid leadId, LeadStage stage, CancellationToken ct);
    Task<bool> AddNoteAsync(Guid leadId, string note, CancellationToken ct);
}