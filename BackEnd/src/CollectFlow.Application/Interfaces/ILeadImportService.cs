using CollectFlow.Application.DTOs.Leads;

namespace CollectFlow.Application.Interfaces;

public interface ILeadImportService
{
    Task<ImportLeadsResponse> ImportCsvAsync(
        Stream csvStream,
        CancellationToken cancellationToken = default);
}