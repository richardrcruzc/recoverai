using CollectFlow.Api.Infrastructure.Hangfire;
using CollectFlow.Api.Middleware;
using CollectFlow.Api.Options;
using CollectFlow.Api.Services;
using CollectFlow.Application.DTOs.EmailAutomation;
using CollectFlow.Application.DTOs.Reminders;
using CollectFlow.Application.Interfaces;
using CollectFlow.Infrastructure;
using CollectFlow.Infrastructure.Persistence;
using Hangfire;
using Hangfire.SqlServer;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using Stripe;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

//builder.WebHost.UseSentry(o =>
//{
//    o.Dsn = "https://www.collectflowai.com/@sentry.io/PROJECT_ID";
//    o.TracesSampleRate = 0.2;
//});

builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("public-forms", limiter =>
    {
        limiter.Window = TimeSpan.FromMinutes(1);
        limiter.PermitLimit = 5;
        limiter.QueueLimit = 0;
    });
});

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.Configure<StripeOptions>(
    builder.Configuration.GetSection(StripeOptions.SectionName));

StripeConfiguration.ApiKey = builder.Configuration["Stripe:SecretKey"];

builder.Services.Configure<JwtOptions>(
    builder.Configuration.GetSection(JwtOptions.SectionName));

var jwtOptions = builder.Configuration
    .GetSection(JwtOptions.SectionName)
    .Get<JwtOptions>() ?? new JwtOptions();

builder.Services.AddSingleton<JwtTokenService>();

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            ValidIssuer = jwtOptions.Issuer,
            ValidAudience = jwtOptions.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtOptions.Key)),
            ClockSkew = TimeSpan.FromMinutes(2)
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .WithOrigins(
                "http://localhost:5173",
                "http://localhost:3000",
                "http://collectflowai.com",
                "http://www.collectflowai.com",
                "https://collectflowai.com",
                "https://www.collectflowai.com");
    });
});

builder.Services.AddHangfire(config =>
{
    config.SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
        .UseSimpleAssemblyNameTypeSerializer()
        .UseRecommendedSerializerSettings()
        .UseSqlServerStorage(
            builder.Configuration.GetConnectionString("DefaultConnection"),
            new SqlServerStorageOptions
            {
                PrepareSchemaIfNecessary = true
            });
});

builder.Services.AddHangfireServer();

var app = builder.Build();

app.Use(async (ctx, next) =>
{
    var start = DateTime.UtcNow;

    await next();

    var elapsed = (DateTime.UtcNow - start).TotalMilliseconds;

    Console.WriteLine($"{ctx.Request.Method} {ctx.Request.Path} -> {ctx.Response.StatusCode} in {elapsed}ms");
});
app.UseExceptionHandler(appErr =>
{
    appErr.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";

        var ex = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>()?.Error;

        Console.WriteLine(ex?.ToString());

        await context.Response.WriteAsJsonAsync(new
        {
            message = "Internal server error"
        });
    });
});
app.UseHangfireDashboard("/hangfire", new DashboardOptions
{
    Authorization = new[] { new DashboardAuthFilter() }
});
app.UseRateLimiter();

if (app.Environment.IsDevelopment())
{
    await DbSeeder.SeedAsync(app.Services);

    app.MapOpenApi();
    app.MapScalarApiReference(options =>
    {
        options.Title = "CollectFlow API";
        options.Theme = ScalarTheme.Kepler;
    });
}

app.UseHttpsRedirection();
app.UseCors("Frontend");
app.UseStaticFiles();
app.UseAuthentication();
app.UseMiddleware<TenantMiddleware>();
app.UseAuthorization();
app.UseHangfireDashboard("/hangfire");
app.MapControllers();
app.MapFallbackToFile("index.html");

RecurringJob.AddOrUpdate<ITenantJobRunner>(
    "daily-overdue-invoice-reminders",
    runner => runner.RunReminderJobsForAllTenantsAsync(CancellationToken.None),
    "0 8 * * *");

RecurringJob.AddOrUpdate<IEmailAutomationService>(
    "email-automation-due-jobs",
    service => service.RunDueJobsAsync(CancellationToken.None),
    "*/15 * * * *");

RecurringJob.AddOrUpdate<ICollectionsEngineService>(
    "daily-collections-engine",
    service => service.RunAsync(CancellationToken.None),
    "0 8 * * *");

RecurringJob.AddOrUpdate<IEmailReplySyncService>(
    "sync-email-replies",
    svc => svc.SyncRepliesAsync(CancellationToken.None),
    "*/5 * * * *");

RecurringJob.AddOrUpdate<IEmailAutomationService>(
    "queue-daily-lead-email-batch",
    service => service.QueueLeadBatchAsync(
        new QueueLeadBatchRequest
        {
            BatchSize = 50
        },
        CancellationToken.None),
    "0 9 * * 1-5");

app.Run();