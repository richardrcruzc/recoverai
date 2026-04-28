using CollectFlow.Application.DTOs.Leads;
using CollectFlow.Application.Interfaces;
using CollectFlow.Domain.Entities;
using CollectFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CollectFlow.Infrastructure.Services;

public class LeadImportService : ILeadImportService
{
    private readonly CollectFlowDbContext _db;

    public LeadImportService(CollectFlowDbContext db)
    {
        _db = db;
    }

    public async Task<ImportLeadsResponse> ImportCsvAsync(
        Stream csvStream,
        CancellationToken cancellationToken = default)
    {
        var response = new ImportLeadsResponse();

        using var reader = new StreamReader(csvStream);

        var headerLine = await reader.ReadLineAsync(cancellationToken);

        if (string.IsNullOrWhiteSpace(headerLine))
        {
            response.Errors.Add("CSV file is empty.");
            return response;
        }

        var headers = SplitCsvLine(headerLine)
            .Select((name, index) => new { Name = Normalize(name), Index = index })
            .ToDictionary(x => x.Name, x => x.Index);

        var rowNumber = 1;

        while (!reader.EndOfStream)
        {
            rowNumber++;
            var line = await reader.ReadLineAsync(cancellationToken);

            if (string.IsNullOrWhiteSpace(line))
                continue;

            response.TotalRows++;

            try
            {
                var values = SplitCsvLine(line);

                var email = GetValue(headers, values, "email");
                var name = GetFirstAvailable(headers, values, "name", "fullname", "full name");
                var company = GetFirstAvailable(headers, values, "company", "companyname", "organization", "account");
                var phone = GetFirstAvailable(headers, values, "phone", "mobile", "work phone");
                var title = GetFirstAvailable(headers, values, "title", "jobtitle", "job title");
                var source = GetFirstAvailable(headers, values, "source");

                if (string.IsNullOrWhiteSpace(email))
                {
                    response.Failed++;
                    response.Errors.Add($"Row {rowNumber}: email is required.");
                    continue;
                }

                email = email.Trim().ToLowerInvariant();

                var exists = await _db.Leads
                    .IgnoreQueryFilters()
                    .AnyAsync(x => x.Email == email, cancellationToken);

                if (exists)
                {
                    response.Skipped++;
                    continue;
                }

                var lead = new Lead
                {
                    Name = string.IsNullOrWhiteSpace(name) ? email : name.Trim(),
                    Email = email,
                    Company = company.Trim(),
                    Phone = phone.Trim(),
                    Message =
                        $"Imported lead. Title: {title}. Source: {(string.IsNullOrWhiteSpace(source) ? "CSV Import" : source)}",
                    Status = "New"
                };

                _db.Leads.Add(lead);
                response.Imported++;
            }
            catch (Exception ex)
            {
                response.Failed++;
                response.Errors.Add($"Row {rowNumber}: {ex.Message}");
            }
        }

        await _db.SaveChangesAsync(cancellationToken);
        return response;
    }

    private static string Normalize(string value)
    {
        return value
            .Trim()
            .ToLowerInvariant()
            .Replace("_", "")
            .Replace("-", "")
            .Replace(" ", "");
    }

    private static string GetValue(
        Dictionary<string, int> headers,
        List<string> values,
        string key)
    {
        var normalized = Normalize(key);

        if (!headers.TryGetValue(normalized, out var index))
            return string.Empty;

        return index >= values.Count ? string.Empty : values[index].Trim();
    }

    private static string GetFirstAvailable(
        Dictionary<string, int> headers,
        List<string> values,
        params string[] keys)
    {
        foreach (var key in keys)
        {
            var value = GetValue(headers, values, key);

            if (!string.IsNullOrWhiteSpace(value))
                return value;
        }

        return string.Empty;
    }

    private static List<string> SplitCsvLine(string line)
    {
        var result = new List<string>();
        var current = new List<char>();
        var insideQuotes = false;

        for (var i = 0; i < line.Length; i++)
        {
            var c = line[i];

            if (c == '"')
            {
                insideQuotes = !insideQuotes;
                continue;
            }

            if (c == ',' && !insideQuotes)
            {
                result.Add(new string(current.ToArray()));
                current.Clear();
                continue;
            }

            current.Add(c);
        }

        result.Add(new string(current.ToArray()));

        return result;
    }
}