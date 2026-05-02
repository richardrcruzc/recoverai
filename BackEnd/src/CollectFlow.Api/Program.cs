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

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var jwtOptions = builder.Configuration
        .GetSection("Jwt")
        .Get<JwtOptions>();

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = jwtOptions?.Issuer ?? string.Empty,
        ValidAudience = jwtOptions?.Audience ?? string.Empty,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtOptions?.Key ?? string.Empty)),

        ClockSkew = TimeSpan.Zero
    };

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var token = context.Request.Cookies["cf_auth"];

            Console.WriteLine($"COOKIE FOUND: {!string.IsNullOrWhiteSpace(token)}");

            if (!string.IsNullOrEmpty(token))
                context.Token = token;

            return Task.CompletedTask;
        },
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine("JWT FAILED: " + context.Exception.Message);
            return Task.CompletedTask;
        },
        OnChallenge = context =>
        {
            Console.WriteLine("JWT CHALLENGE:");
            Console.WriteLine(context.Error);
            Console.WriteLine(context.ErrorDescription);
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization();
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy 
            .WithOrigins(
                "http://localhost:5173",
                "http://localhost:3000",
                "http://collectflowai.com",
                "http://www.collectflowai.com",
                "https://collectflowai.com",
                "https://www.collectflowai.com")
             .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
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