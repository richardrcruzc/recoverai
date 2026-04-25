using CollectFlow.Application.DTOs.Customers;
using CollectFlow.Application.Interfaces;
using CollectFlow.Domain.Entities;
using CollectFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CollectFlow.Infrastructure.Services;

public class CustomerService : ICustomerService
{
    private readonly CollectFlowDbContext _dbContext;

    public CustomerService(CollectFlowDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<CustomerResponse>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Customers
            .AsNoTracking()
            .OrderByDescending(x => x.CreatedAtUtc)
            .Select(x => new CustomerResponse
            {
                Id = x.Id,
                TenantId = x.TenantId,
                Name = x.Name,
                CompanyName = x.CompanyName,
                Email = x.Email,
                Phone = x.Phone,
                Notes = x.Notes,
                CreatedAtUtc = x.CreatedAtUtc
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<CustomerResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var customer = await _dbContext.Customers
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        return customer is null ? null : Map(customer);
    }

    public async Task<CustomerResponse> CreateAsync(CreateCustomerRequest request, CancellationToken cancellationToken = default)
    {
        var tenantExists = await _dbContext.Tenants.AnyAsync(x => x.Id == request.TenantId, cancellationToken);
        if (!tenantExists)
            throw new InvalidOperationException("Tenant not found.");

        var customer = new Customer
        {
            TenantId = request.TenantId,
            Name = request.Name.Trim(),
            CompanyName = request.CompanyName.Trim(),
            Email = request.Email.Trim().ToLowerInvariant(),
            Phone = request.Phone.Trim(),
            Notes = request.Notes.Trim()
        };

        _dbContext.Customers.Add(customer);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Map(customer);
    }

    public async Task<CustomerResponse?> UpdateAsync(Guid id, UpdateCustomerRequest request, CancellationToken cancellationToken = default)
    {
        var customer = await _dbContext.Customers.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (customer is null)
            return null;

        customer.Name = request.Name.Trim();
        customer.CompanyName = request.CompanyName.Trim();
        customer.Email = request.Email.Trim().ToLowerInvariant();
        customer.Phone = request.Phone.Trim();
        customer.Notes = request.Notes.Trim();
        customer.UpdatedAtUtc = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return Map(customer);
    }

    private static CustomerResponse Map(Customer customer) => new()
    {
        Id = customer.Id,
        TenantId = customer.TenantId,
        Name = customer.Name,
        CompanyName = customer.CompanyName,
        Email = customer.Email,
        Phone = customer.Phone,
        Notes = customer.Notes,
        CreatedAtUtc = customer.CreatedAtUtc
    };
}
