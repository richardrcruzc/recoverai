using CollectFlow.Application.DTOs.Collections;

namespace CollectFlow.Application.Interfaces;

public interface ICollectionsEngineService
{
    Task<RunCollectionsEngineResponse> RunAsync(CancellationToken cancellationToken = default);

    Task<IReadOnlyList<CollectionActionResponse>> GetActionsAsync(
        CancellationToken cancellationToken = default);

    Task<bool> CompleteActionAsync(
        Guid actionId,
        CompleteCollectionActionRequest request,
        CancellationToken cancellationToken = default);
}