using CollectFlow.Domain.Entities;
using CollectFlow.Infrastructure.Tenancy;
using Microsoft.EntityFrameworkCore; 

namespace CollectFlow.Infrastructure.Persistence;

public class CollectFlowDbContext : DbContext
{
    private readonly TenantContext _tenantContext;
    public CollectFlowDbContext(
         DbContextOptions<CollectFlowDbContext> options,
         TenantContext tenantContext) : base(options)
    {
        _tenantContext = tenantContext;
    } 
    public DbSet<TenantSubscription> TenantSubscriptions => Set<TenantSubscription>();
    public DbSet<Tenant> Tenants => Set<Tenant>();
    public DbSet<RecoveryFee> RecoveryFees => Set<RecoveryFee>();
    public DbSet<RevenueEvent> RevenueEvents => Set<RevenueEvent>();
    public DbSet<InvoiceScore> InvoiceScores => Set<InvoiceScore>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<ReminderLog> ReminderLogs => Set<ReminderLog>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>(); 
    public DbSet<Lead> Leads => Set<Lead>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Invoice> Invoices => Set<Invoice>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<RevenueEvent>(entity =>
        {
            entity.ToTable("RevenueEvents");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.EventType).HasMaxLength(100).IsRequired();
            entity.Property(x => x.Metadata).HasMaxLength(4000);
        });

        modelBuilder.Entity<RevenueEvent>().HasQueryFilter(x =>
            !_tenantContext.HasTenant || x.TenantId == _tenantContext.TenantId);
        modelBuilder.Entity<TenantSubscription>(entity =>
        {
            entity.ToTable("TenantSubscriptions");
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Plan).HasConversion<int>().IsRequired();
            entity.Property(x => x.StripeCustomerId).HasMaxLength(200);
            entity.Property(x => x.StripeSubscriptionId).HasMaxLength(200);

            entity.HasIndex(x => x.TenantId).IsUnique();

            entity.HasOne(x => x.Tenant)
                .WithMany()
                .HasForeignKey(x => x.TenantId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<TenantSubscription>().HasQueryFilter(x =>
            !_tenantContext.HasTenant || x.TenantId == _tenantContext.TenantId);
        modelBuilder.Entity<RecoveryFee>(entity =>
        {
            entity.ToTable("RecoveryFees");
            entity.HasKey(x => x.Id);

            entity.Property(x => x.RecoveredAmount).HasColumnType("decimal(18,2)");
            entity.Property(x => x.FeeRate).HasColumnType("decimal(5,4)");
            entity.Property(x => x.FeeAmount).HasColumnType("decimal(18,2)");
            entity.Property(x => x.Currency).HasMaxLength(3).IsRequired();

            entity.HasOne(x => x.Payment)
                .WithMany()
                .HasForeignKey(x => x.PaymentId)
                .OnDelete(DeleteBehavior.Restrict);
        });
        modelBuilder.Entity<Tenant>(entity =>
        {
            entity.ToTable("Tenants");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Name).HasMaxLength(200).IsRequired();
            entity.Property(x => x.Slug).HasMaxLength(100).IsRequired();
            entity.HasIndex(x => x.Slug).IsUnique();
        });

        modelBuilder.Entity<Lead>(entity =>
        {
            entity.ToTable("Leads");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Name).HasMaxLength(150).IsRequired();
            entity.Property(x => x.Email).HasMaxLength(256).IsRequired();
            entity.Property(x => x.Phone).HasMaxLength(50);
            entity.Property(x => x.Company).HasMaxLength(200).IsRequired();
            entity.Property(x => x.InvoiceVolume).HasMaxLength(100).IsRequired();
            entity.Property(x => x.BiggestProblem).HasMaxLength(2000).IsRequired();
            entity.Property(x => x.Source).HasMaxLength(100).IsRequired();
            entity.Property(x => x.Status).HasConversion<int>().IsRequired();
            entity.HasIndex(x => x.Email);
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.ToTable("Customers");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Name).HasMaxLength(200).IsRequired();
            entity.Property(x => x.CompanyName).HasMaxLength(200);
            entity.Property(x => x.Email).HasMaxLength(256);
            entity.Property(x => x.Phone).HasMaxLength(50);
            entity.Property(x => x.Notes).HasMaxLength(2000);
            entity.HasOne(x => x.Tenant)
                .WithMany(x => x.Customers)
                .HasForeignKey(x => x.TenantId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Invoice>(entity =>
        {
            entity.ToTable("Invoices");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.InvoiceNumber).HasMaxLength(100).IsRequired();
            entity.Property(x => x.Amount).HasColumnType("decimal(18,2)");
            entity.Property(x => x.Balance).HasColumnType("decimal(18,2)");
            entity.Property(x => x.Currency).HasMaxLength(3).IsRequired();
            entity.Property(x => x.Status).HasConversion<int>().IsRequired();

            entity.HasOne(x => x.Tenant)
                .WithMany()
                .HasForeignKey(x => x.TenantId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.Customer)
                .WithMany(x => x.Invoices)
                .HasForeignKey(x => x.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<AdminUser>(entity =>
        {
            entity.ToTable("AdminUsers");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.FullName).HasMaxLength(150).IsRequired();
            entity.Property(x => x.Email).HasMaxLength(256).IsRequired();
            entity.Property(x => x.PasswordHash).HasMaxLength(1000).IsRequired();
            entity.Property(x => x.Role).HasConversion<int>().IsRequired();
            entity.HasIndex(x => x.Email).IsUnique();

            entity.HasOne(x => x.Tenant)
                .WithMany()
                .HasForeignKey(x => x.TenantId)
                .OnDelete(DeleteBehavior.Restrict);
        });
        modelBuilder.Entity<Customer>().HasQueryFilter(x =>
           !_tenantContext.HasTenant || x.TenantId == _tenantContext.TenantId);

        modelBuilder.Entity<Invoice>().HasQueryFilter(x =>
            !_tenantContext.HasTenant || x.TenantId == _tenantContext.TenantId);

        modelBuilder.Entity<Payment>().HasQueryFilter(x =>
            !_tenantContext.HasTenant || x.TenantId == _tenantContext.TenantId);

        modelBuilder.Entity<ReminderLog>().HasQueryFilter(x =>
            !_tenantContext.HasTenant || x.TenantId == _tenantContext.TenantId);

        modelBuilder.Entity<InvoiceScore>().HasQueryFilter(x =>
            !_tenantContext.HasTenant || x.TenantId == _tenantContext.TenantId);

        modelBuilder.Entity<RecoveryFee>().HasQueryFilter(x =>
            !_tenantContext.HasTenant || x.TenantId == _tenantContext.TenantId);

        modelBuilder.Entity<AdminUser>().HasQueryFilter(x =>
            !_tenantContext.HasTenant || x.TenantId == _tenantContext.TenantId);

        modelBuilder.Entity<ReminderLog>(entity =>
        {
            entity.ToTable("ReminderLogs");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Channel).HasMaxLength(50).IsRequired();
            entity.Property(x => x.Subject).HasMaxLength(200).IsRequired();
            entity.Property(x => x.Body).HasMaxLength(2000).IsRequired();
            entity.Property(x => x.Status).HasConversion<int>().IsRequired();
            entity.Property(x => x.ErrorMessage).HasMaxLength(1000);

            //entity.HasOne(x => x.Tenant)
            //    .WithMany()
            //    .HasForeignKey(x => x.TenantId)
            //    .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.Invoice)
                .WithMany()
                .HasForeignKey(x => x.InvoiceId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.Customer)
                .WithMany()
                .HasForeignKey(x => x.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);
        });
        modelBuilder.Entity<Payment>(entity =>
        {
            entity.ToTable("Payments");
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Amount).HasColumnType("decimal(18,2)");
            entity.Property(x => x.Currency).HasMaxLength(3).IsRequired();
            entity.Property(x => x.ReferenceNumber).HasMaxLength(100);
            entity.Property(x => x.Notes).HasMaxLength(2000);

            entity.HasOne(x => x.Invoice)
                .WithMany()
                .HasForeignKey(x => x.InvoiceId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.Customer)
                .WithMany()
                .HasForeignKey(x => x.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);
        });
        modelBuilder.Entity<InvoiceScore>(entity =>
        {
            entity.ToTable("InvoiceScores");
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Score).IsRequired();
            entity.Property(x => x.Priority).HasConversion<int>().IsRequired();
            entity.Property(x => x.Balance).HasColumnType("decimal(18,2)");
            entity.Property(x => x.Reason).HasMaxLength(2000);

            entity.HasIndex(x => x.InvoiceId).IsUnique();

            entity.HasOne(x => x.Invoice)
                .WithMany()
                .HasForeignKey(x => x.InvoiceId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.Customer)
                .WithMany()
                .HasForeignKey(x => x.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}