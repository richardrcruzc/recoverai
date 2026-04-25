namespace CollectFlow.Domain.Entities;

public class Tenant : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;

    public ICollection<Lead> Leads { get; set; } = new List<Lead>();
    public ICollection<Customer> Customers { get; set; } = new List<Customer>();
}
