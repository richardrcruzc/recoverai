using CollectFlow.Application.DTOs.Payments;

namespace CollectFlow.Application.Interfaces;

public interface IPaymentService
{
    Task<IReadOnlyList<PaymentResponse>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<PaymentResponse>> GetByInvoiceIdAsync(Guid invoiceId, CancellationToken cancellationToken = default);
    Task<PaymentResponse> CreateAsync(CreatePaymentRequest request, CancellationToken cancellationToken = default);
}