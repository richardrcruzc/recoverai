using CollectFlow.Application.DTOs.Leads;
using CollectFlow.Application.Interfaces;
using CollectFlow.Domain.Entities;
using CollectFlow.Domain.Enums;
using CollectFlow.Infrastructure.Options;
using CollectFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace CollectFlow.Infrastructure.Services;

public class LeadService : ILeadService
{
    private readonly CollectFlowDbContext _dbContext;
    private readonly IEmailService _emailService;
    private readonly EmailOptions _emailOptions;

    public LeadService(
        CollectFlowDbContext dbContext,
        IEmailService emailService,
        IOptions<EmailOptions> emailOptions)
    {
        _dbContext = dbContext;
        _emailService = emailService;
        _emailOptions = emailOptions.Value;
    }

    public async Task<LeadResponse> CreateAsync(CreateLeadRequest request, CancellationToken cancellationToken = default)
    {
        var lead = new Lead
        {
            Name = request.Name.Trim(),
            Email = request.Email.Trim().ToLowerInvariant(),
            Phone = request.Phone.Trim(),
            Company = request.Company.Trim(),
            InvoiceVolume = request.InvoiceVolume.Trim(),
            BiggestProblem = request.BiggestProblem.Trim(),
            Source = "landing-page",
            Status = LeadStatus.New
        };

        _dbContext.Leads.Add(lead);
        await _dbContext.SaveChangesAsync(cancellationToken);

        await SendLeadEmailsAsync(lead, cancellationToken);

        return Map(lead);
    }

    public async Task<IReadOnlyList<LeadResponse>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Leads
            .AsNoTracking()
            .OrderByDescending(x => x.CreatedAtUtc)
            .Select(x => new LeadResponse
            {
                Id = x.Id,
                Name = x.Name,
                Email = x.Email,
                Phone = x.Phone,
                Company = x.Company,
                InvoiceVolume = x.InvoiceVolume,
                BiggestProblem = x.BiggestProblem,
                Source = x.Source,
                Status = x.Status,
                CreatedAtUtc = x.CreatedAtUtc
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> UpdateStatusAsync(Guid id, string status, CancellationToken cancellationToken = default)
    {
        var lead = await _dbContext.Leads.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (lead is null)
            return false;

        if (!Enum.TryParse<LeadStatus>(status, true, out var parsed))
            return false;

        lead.Status = parsed;
        lead.UpdatedAtUtc = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    private async Task SendLeadEmailsAsync(Lead lead, CancellationToken cancellationToken)
    {
        var internalHtml = $@"
            <h2>New CollectFlow Lead</h2>
            <p><strong>Name:</strong> {lead.Name}</p>
            <p><strong>Email:</strong> {lead.Email}</p>
            <p><strong>Phone:</strong> {lead.Phone}</p>
            <p><strong>Company:</strong> {lead.Company}</p>
            <p><strong>Invoice Volume:</strong> {lead.InvoiceVolume}</p>
            <p><strong>Biggest Problem:</strong> {lead.BiggestProblem}</p>
            <p><strong>Created:</strong> {lead.CreatedAtUtc:u}</p>";

        var confirmationHtml = $@"
            <h2>Thanks for contacting CollectFlow</h2>
            <p>Hi {lead.Name},</p>
            <p>We received your request and will follow up shortly to schedule a demo.</p>
            <p>Regards,<br/>CollectFlow</p>";

        await _emailService.SendAsync(
            _emailOptions.NotifyEmail,
            $"New CollectFlow lead from {lead.Company}",
            internalHtml,
            cancellationToken);

        await _emailService.SendAsync(
            lead.Email,
            "Your CollectFlow demo request",
            confirmationHtml,
            cancellationToken);
    }

    private static LeadResponse Map(Lead lead) => new()
    {
        Id = lead.Id,
        Name = lead.Name,
        Email = lead.Email,
        Phone = lead.Phone,
        Company = lead.Company,
        InvoiceVolume = lead.InvoiceVolume,
        BiggestProblem = lead.BiggestProblem,
        Source = lead.Source,
        Status = lead.Status,
        CreatedAtUtc = lead.CreatedAtUtc
    };
}
