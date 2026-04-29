public interface IEmailReplySyncService
{
    Task<int> SyncRepliesAsync(CancellationToken ct);
}