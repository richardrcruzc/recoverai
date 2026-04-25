using CollectFlow.Application.DTOs.Invoices;
using CollectFlow.Application.Interfaces;
using CollectFlow.Domain.Entities;
using CollectFlow.Domain.Enums;
using CollectFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CollectFlow.Infrastructure.Services;

public class InvoiceService : IInvoiceService
{
    private readonly CollectFlowDbContext _db;

    public InvoiceService(CollectFlowDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<InvoiceResponse>> GetAllAsync(string? status = null)
    {
        var query = _db.Invoices
            .Include(x => x.Customer)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) &&
            Enum.TryParse<InvoiceStatus>(status, true, out var parsed))
        {
            query = query.Where(x => x.Status == parsed);
        }

        return await query
            .OrderByDescending(x => x.CreatedAtUtc)
            .Select(x => new InvoiceResponse
            {
                Id = x.Id,
                CustomerId = x.CustomerId,
                CustomerName = x.Customer.Name,
                InvoiceNumber = x.InvoiceNumber,
                IssueDate = x.IssueDate,
                DueDate = x.DueDate,
                Amount = x.Amount,
                Balance = x.Balance,
                Status = x.Status,
                DaysOverdue = x.Balance > 0 && x.DueDate < DateOnly.FromDateTime(DateTime.UtcNow)
                    ? DateOnly.FromDateTime(DateTime.UtcNow).DayNumber - x.DueDate.DayNumber
                    : 0
            })
            .ToListAsync();
    }

    public async Task<InvoiceResponse> CreateAsync(CreateInvoiceRequest request)
    {
        var invoice = new Invoice
        {
            TenantId = request.TenantId,
            CustomerId = request.CustomerId,
            InvoiceNumber = request.InvoiceNumber,
            IssueDate = request.IssueDate,
            DueDate = request.DueDate,
            Amount = request.Amount,
            Balance = request.Balance == 0 ? request.Amount : request.Balance,
            Currency = request.Currency,
            Status = request.Status
        };

        _db.Invoices.Add(invoice);
        await _db.SaveChangesAsync();

        return new InvoiceResponse
        {
            Id = invoice.Id,
            CustomerId = invoice.CustomerId,
            InvoiceNumber = invoice.InvoiceNumber,
            IssueDate = invoice.IssueDate,
            DueDate = invoice.DueDate,
            Amount = invoice.Amount,
            Balance = invoice.Balance,
            Status = invoice.Status
        };
    }

    public async Task<InvoiceResponse?> UpdateStatusAsync(Guid id, UpdateInvoiceStatusRequest request)
    {
        var invoice = await _db.Invoices.Include(x => x.Customer).FirstOrDefaultAsync(x => x.Id == id);
        if (invoice == null) return null;

        invoice.Status = request.Status;

        if (request.Status == InvoiceStatus.Paid)
            invoice.Balance = 0;

        await _db.SaveChangesAsync();

        return new InvoiceResponse
        {
            Id = invoice.Id,
            CustomerId = invoice.CustomerId,
            CustomerName = invoice.Customer.Name,
            InvoiceNumber = invoice.InvoiceNumber,
            IssueDate = invoice.IssueDate,
            DueDate = invoice.DueDate,
            Amount = invoice.Amount,
            Balance = invoice.Balance,
            Status = invoice.Status
        };
    }
}