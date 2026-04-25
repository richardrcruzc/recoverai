using CollectFlow.Domain.Enums;

namespace CollectFlow.Application.DTOs.Invoices;

public class UpdateInvoiceStatusRequest
{
    public InvoiceStatus Status { get; set; }
}