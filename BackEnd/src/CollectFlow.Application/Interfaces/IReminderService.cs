using CollectFlow.Application.DTOs.Reminders;

namespace CollectFlow.Application.Interfaces;

public interface IReminderService
{
    Task<RunReminderResponse> RunAsync(RunReminderRequest request, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<ReminderLogResponse>> GetLogsAsync(CancellationToken cancellationToken = default);
}