using CollectFlow.Application.DTOs.Payments;
using CollectFlow.Application.Interfaces;
using CollectFlow.Domain.Entities;
using CollectFlow.Domain.Enums;
using CollectFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CollectFlow.Infrastructure.Services;

public class PaymentService : IPaymentService
{
    private readonly CollectFlowDbContext _db;

    public PaymentService(CollectFlowDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<PaymentResponse>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _db.Payments
            .AsNoTracking()
            .Include(x => x.Invoice)
            .Include(x => x.Customer)
            .OrderByDescending(x => x.PaymentDate)
            .ThenByDescending(x => x.CreatedAtUtc)
            .Select(x => new PaymentResponse
            {
                Id = x.Id,
                TenantId = x.TenantId,
                InvoiceId = x.InvoiceId,
                CustomerId = x.CustomerId,
                InvoiceNumber = x.Invoice.InvoiceNumber,
                CustomerName = x.Customer.Name,
                CustomerCompanyName = x.Customer.CompanyName,
                Amount = x.Amount,
                Currency = x.Currency,
                PaymentDate = x.PaymentDate,
                ReferenceNumber = x.ReferenceNumber,
                Notes = x.Notes,
                CreatedAtUtc = x.CreatedAtUtc
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<PaymentResponse>> GetByInvoiceIdAsync(
        Guid invoiceId,
        CancellationToken cancellationToken = default)
    {
        return await _db.Payments
            .AsNoTracking()
            .Include(x => x.Invoice)
            .Include(x => x.Customer)
            .Where(x => x.InvoiceId == invoiceId)
            .OrderByDescending(x => x.PaymentDate)
            .Select(x => new PaymentResponse
            {
                Id = x.Id,
                TenantId = x.TenantId,
                InvoiceId = x.InvoiceId,
                CustomerId = x.CustomerId,
                InvoiceNumber = x.Invoice.InvoiceNumber,
                CustomerName = x.Customer.Name,
                CustomerCompanyName = x.Customer.CompanyName,
                Amount = x.Amount,
                Currency = x.Currency,
                PaymentDate = x.PaymentDate,
                ReferenceNumber = x.ReferenceNumber,
                Notes = x.Notes,
                CreatedAtUtc = x.CreatedAtUtc
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<PaymentResponse> CreateAsync(
        CreatePaymentRequest request,
        CancellationToken cancellationToken = default)
    {
        var invoice = await _db.Invoices
            .Include(x => x.Customer)
            .FirstOrDefaultAsync(x => x.Id == request.InvoiceId, cancellationToken);

        if (invoice is null)
            throw new InvalidOperationException("Invoice not found.");

        if (request.Amount <= 0)
            throw new InvalidOperationException("Payment amount must be greater than zero.");

        if (request.Amount > invoice.Balance)
            throw new InvalidOperationException("Payment amount cannot exceed invoice balance.");


        var payment = new Payment
        {
            TenantId = invoice.TenantId,
            InvoiceId = invoice.Id,
            CustomerId = invoice.CustomerId,
            Amount = request.Amount,
            Currency = string.IsNullOrWhiteSpace(request.Currency)
                ? invoice.Currency
                : request.Currency.Trim().ToUpperInvariant(),
            PaymentDate = request.PaymentDate,
            ReferenceNumber = request.ReferenceNumber.Trim(),
            Notes = request.Notes.Trim()
        };

        invoice.Balance -= request.Amount;
        invoice.UpdatedAtUtc = DateTime.UtcNow;

        if (invoice.Balance <= 0)
        {
            invoice.Balance = 0;
            invoice.Status = InvoiceStatus.Paid;
        }
        else
        {
            invoice.Status = InvoiceStatus.PartiallyPaid;
        }
        var feeRate = 0.03m;

        var recoveryFee = new RecoveryFee
        {
            TenantId = invoice.TenantId,
            PaymentId = payment.Id,
            InvoiceId = invoice.Id,
            CustomerId = invoice.CustomerId,
            RecoveredAmount = payment.Amount,
            FeeRate = feeRate,
            FeeAmount = Math.Round(payment.Amount * feeRate, 2),
            Currency = payment.Currency,
            IsBilled = false
        };

        _db.RecoveryFees.Add(recoveryFee);
        _db.Payments.Add(payment);
        await _db.SaveChangesAsync(cancellationToken);

        return new PaymentResponse
        {
            Id = payment.Id,
            TenantId = payment.TenantId,
            InvoiceId = payment.InvoiceId,
            CustomerId = payment.CustomerId,
            InvoiceNumber = invoice.InvoiceNumber,
            CustomerName = invoice.Customer.Name,
            CustomerCompanyName = invoice.Customer.CompanyName,
            Amount = payment.Amount,
            Currency = payment.Currency,
            PaymentDate = payment.PaymentDate,
            ReferenceNumber = payment.ReferenceNumber,
            Notes = payment.Notes,
            CreatedAtUtc = payment.CreatedAtUtc
        };
    }
}