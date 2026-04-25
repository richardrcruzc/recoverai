# CollectFlow / RecoverAI .NET 10 SaaS Backend Starter

ASP.NET Core Web API backend starter for an AI collections SaaS.

## Features

- .NET 10 Web API structure
- Lead capture endpoint
- Email notification to `info@recoverAI.net`
- Confirmation email to prospect
- EF Core DbContext
- SQL Server-ready configuration
- CORS for React/Vite frontend
- Swagger/OpenAPI
- Clean layered structure:
  - Api
  - Application
  - Domain
  - Infrastructure

## Run

```bash
dotnet restore
dotnet build
dotnet run --project src/CollectFlow.Api
```

Swagger:

```text
https://localhost:7001/swagger
```

## Configure appsettings

Edit:

```text
src/CollectFlow.Api/appsettings.Development.json
```

Set:

- database connection string
- SMTP settings

## Create database

From the solution root:

```bash
dotnet tool install --global dotnet-ef
dotnet ef migrations add InitialCreate --project src/CollectFlow.Infrastructure --startup-project src/CollectFlow.Api
dotnet ef database update --project src/CollectFlow.Infrastructure --startup-project src/CollectFlow.Api
```

## React frontend endpoint

Your React form should post to:

```text
POST https://localhost:7001/api/leads
```

Example body:

```json
{
  "name": "Jane Smith",
  "email": "jane@company.com",
  "phone": "555-111-2222",
  "company": "Acme Studio",
  "invoiceVolume": "15 invoices / $25k overdue",
  "biggestProblem": "Clients pay late and reminders are inconsistent"
}
```

## Important

This starter uses SMTP for email. You can replace it with SendGrid, Resend, Mailgun, or Microsoft Graph later.
