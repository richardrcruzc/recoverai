# CollectFlow .NET 10 SaaS Backend Starter - Fixed Build

This version fixes the build issue by keeping dependencies in the correct direction:

- Domain: entities and enums only
- Application: DTOs and interfaces only
- Infrastructure: EF Core, DbContext, email service, LeadService implementation
- Api: controllers and dependency wiring

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

## Database

```bash
dotnet tool install --global dotnet-ef
dotnet ef migrations add InitialCreate --project src/CollectFlow.Infrastructure --startup-project src/CollectFlow.Api
dotnet ef database update --project src/CollectFlow.Infrastructure --startup-project src/CollectFlow.Api
```

## Endpoint

```text
POST https://localhost:7001/api/leads
```
