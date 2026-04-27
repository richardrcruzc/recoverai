using System.Globalization;
using CsvHelper;
using CsvHelper.Configuration;
using CollectFlow.Application.DTOs.Imports;
using CollectFlow.Application.Interfaces;
using CollectFlow.Domain.Entities;
using CollectFlow.Domain.Enums;
using CollectFlow.Infrastructure.Persistence;
using CollectFlow.Infrastructure.Tenancy;
using Microsoft.EntityFrameworkCore;

namespace CollectFlow.Infrastructure.Services;

public class InvoiceImportService : IInvoiceImportService
{
    private readonly CollectFlowDbContext _db;
    private readonly TenantContext _tenantContext;
    private readonly IPlanLimitService _planLimitService;

    public InvoiceImportService(
        CollectFlowDbContext db,
        TenantContext tenantContext,
        IPlanLimitService planLimitService)
    {
        _db = db;
        _tenantContext = tenantContext;
        _planLimitService = planLimitService;
    }

    public async Task<ImportInvoicesResponse> ImportAsync(
        Stream csvStream,
        CancellationToken cancellationToken = default)
    {
        var tenantId = _tenantContext.RequireTenantId();
        var response = new ImportInvoicesResponse();

        using var reader = new StreamReader(csvStream);
        using var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            HeaderValidated = null,
            MissingFieldFound = null,
            TrimOptions = TrimOptions.Trim,
            BadDataFound = null
        });

        var rows = csv.GetRecords<InvoiceImportRow>().ToList();

        foreach (var row in rows)
        {
            response.RowsRead++;

            try
            {
                await _planLimitService.EnsureCanCreateInvoiceAsync(cancellationToken);

                if (string.IsNullOrWhiteSpace(row.CustomerName) &&
                    string.IsNullOrWhiteSpace(row.CompanyName))
                {
                    response.RowsSkipped++;
                    response.Errors.Add($"Row {response.RowsRead}: CustomerName or CompanyName is required.");
                    continue;
                }

                if (string.IsNullOrWhiteSpace(row.InvoiceNumber))
                {
                    response.RowsSkipped++;
                    response.Errors.Add($"Row {response.RowsRead}: InvoiceNumber is required.");
                    continue;
                }

                if (!DateOnly.TryParse(row.IssueDate, out var issueDate))
                {
                    response.RowsSkipped++;
                    response.Errors.Add($"Row {response.RowsRead}: Invalid IssueDate.");
                    continue;
                }

                if (!DateOnly.TryParse(row.DueDate, out var dueDate))
                {
                    response.RowsSkipped++;
                    response.Errors.Add($"Row {response.RowsRead}: Invalid DueDate.");
                    continue;
                }

                if (!decimal.TryParse(row.Amount, out var amount) || amount <= 0)
                {
                    response.RowsSkipped++;
                    response.Errors.Add($"Row {response.RowsRead}: Invalid Amount.");
                    continue;
                }

                var balance = amount;

                if (!string.IsNullOrWhiteSpace(row.Balance) &&
                    decimal.TryParse(row.Balance, out var parsedBalance))
                {
                    balance = parsedBalance;
                }

                var email = row.Email.Trim().ToLowerInvariant();
                var companyName = row.CompanyName.Trim();
                var customerName = row.CustomerName.Trim();

                var customer = await FindCustomerAsync(
                    tenantId,
                    email,
                    companyName,
                    customerName,
                    cancellationToken);

                if (customer is null)
                {
                    await _planLimitService.EnsureCanCreateCustomerAsync(cancellationToken);

                    customer = new Customer
                    {
                        TenantId = tenantId,
                        Name = string.IsNullOrWhiteSpace(customerName) ? companyName : customerName,
                        CompanyName = companyName,
                        Email = email,
                        Phone = row.Phone.Trim()
                    };

                    _db.Customers.Add(customer);
                    response.CustomersCreated++;
                }

                var invoiceExists = await _db.Invoices.AnyAsync(
                    x => x.InvoiceNumber == row.InvoiceNumber.Trim(),
                    cancellationToken);

                if (invoiceExists)
                {
                    response.RowsSkipped++;
                    response.Errors.Add($"Row {response.RowsRead}: Invoice {row.InvoiceNumber} already exists.");
                    continue;
                }

                var invoice = new Invoice
                {
                    TenantId = tenantId,
                    Customer = customer,
                    CustomerId = customer.Id,
                    InvoiceNumber = row.InvoiceNumber.Trim(),
                    IssueDate = issueDate,
                    DueDate = dueDate,
                    Amount = amount,
                    Balance = balance,
                    Currency = string.IsNullOrWhiteSpace(row.Currency)
                        ? "USD"
                        : row.Currency.Trim().ToUpperInvariant(),
                    Status = GetInvoiceStatus(balance, dueDate)
                };

                _db.Invoices.Add(invoice);
                response.InvoicesCreated++;
            }
            catch (Exception ex)
            {
                response.RowsSkipped++;
                response.Errors.Add($"Row {response.RowsRead}: {ex.Message}");
            }
        }

        await _db.SaveChangesAsync(cancellationToken);

        return response;
    }

    private async Task<Customer?> FindCustomerAsync(
        Guid tenantId,
        string email,
        string companyName,
        string customerName,
        CancellationToken cancellationToken)
    {
        if (!string.IsNullOrWhiteSpace(email))
        {
            var byEmail = await _db.Customers.FirstOrDefaultAsync(
                x => x.Email == email,
                cancellationToken);

            if (byEmail is not null)
                return byEmail;
        }

        if (!string.IsNullOrWhiteSpace(companyName))
        {
            var byCompany = await _db.Customers.FirstOrDefaultAsync(
                x => x.CompanyName == companyName,
                cancellationToken);

            if (byCompany is not null)
                return byCompany;
        }

        if (!string.IsNullOrWhiteSpace(customerName))
        {
            return await _db.Customers.FirstOrDefaultAsync(
                x => x.Name == customerName,
                cancellationToken);
        }

        return null;
    }

    private static InvoiceStatus GetInvoiceStatus(decimal balance, DateOnly dueDate)
    {
        if (balance <= 0)
            return InvoiceStatus.Paid;

        if (dueDate < DateOnly.FromDateTime(DateTime.UtcNow))
            return InvoiceStatus.Overdue;

        return InvoiceStatus.Sent;
    }

    private sealed class InvoiceImportRow
    {
        public string CustomerName { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string InvoiceNumber { get; set; } = string.Empty;
        public string IssueDate { get; set; } = string.Empty;
        public string DueDate { get; set; } = string.Empty;
        public string Amount { get; set; } = string.Empty;
        public string Balance { get; set; } = string.Empty;
        public string Currency { get; set; } = "USD";
    }
}