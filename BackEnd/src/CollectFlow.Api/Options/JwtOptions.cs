namespace CollectFlow.Api.Options;

public class JwtOptions
{
    public const string SectionName = "Jwt";

    public string Issuer { get; set; } = "CollectFlow";
    public string Audience { get; set; } = "CollectFlow.Admin";
    public string Key { get; set; } = string.Empty;
    public int ExpiresMinutes { get; set; } = 480;
}
