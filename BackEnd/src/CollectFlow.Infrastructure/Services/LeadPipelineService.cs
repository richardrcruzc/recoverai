using CollectFlow.Domain.Enums;
using CollectFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

public class LeadPipelineService : ILeadPipelineService
{
    private readonly CollectFlowDbContext _db;

    public LeadPipelineService(CollectFlowDbContext db)
    {
        _db = db;
    }

    public async Task<bool> UpdateStageAsync(Guid leadId, LeadStage stage, CancellationToken ct)
    {
        var lead = await _db.Leads.FirstOrDefaultAsync(x => x.Id == leadId, ct);
        if (lead is null) return false;

        lead.Stage = stage;

        if (stage == LeadStage.Contacted)
            lead.LastContactedAtUtc = DateTime.UtcNow;

        if (stage == LeadStage.Replied)
            lead.LastRepliedAtUtc = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> AddNoteAsync(Guid leadId, string note, CancellationToken ct)
    {
        var lead = await _db.Leads.FirstOrDefaultAsync(x => x.Id == leadId, ct);
        if (lead is null) return false;

        lead.Notes = string.IsNullOrWhiteSpace(lead.Notes)
            ? note
            : $"{lead.Notes}\n\n{DateTime.UtcNow:u} - {note}";

        await _db.SaveChangesAsync(ct);
        return true;
    }
}