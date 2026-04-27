using CollectFlow.Application.DTOs.LeadScraping;

namespace CollectFlow.Application.Interfaces;

public interface ILeadScrapingService
{
    Task<RunLeadScrapeResponse> RunAsync(
        RunLeadScrapeRequest request,
        CancellationToken cancellationToken = default);
}