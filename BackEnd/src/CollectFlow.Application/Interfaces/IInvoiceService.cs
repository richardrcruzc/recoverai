using CollectFlow.Application.DTOs.Invoices;

namespace CollectFlow.Application.Interfaces;

public interface IInvoiceService
{
    Task<IReadOnlyList<InvoiceResponse>> GetAllAsync(string? status = null);
    Task<InvoiceResponse> CreateAsync(CreateInvoiceRequest request, CancellationToken cancellationToken = default);
    Task<InvoiceResponse?> UpdateStatusAsync(Guid id, UpdateInvoiceStatusRequest request, CancellationToken cancellationToken = default);
}