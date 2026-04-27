using CollectFlow.Application.DTOs.Imports;

namespace CollectFlow.Application.Interfaces;

public interface IInvoiceImportService
{
    Task<ImportInvoicesResponse> ImportAsync(
        Stream csvStream,
        CancellationToken cancellationToken = default);
}