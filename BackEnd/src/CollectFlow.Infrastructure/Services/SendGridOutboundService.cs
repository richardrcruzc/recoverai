using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;

public class SendGridOutboundService : ISendGridOutboundService
{
    private readonly IConfiguration _configuration;

    public SendGridOutboundService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<string> SendOutboundAsync(
        string toEmail,
        string toName,
        string subject,
        string htmlBody,
        string unsubscribeUrl,
        CancellationToken cancellationToken = default)
    {
        var apiKey = _configuration["SendGrid:ApiKey"];
        var fromEmail = _configuration["SendGrid:FromEmail"];
        var fromName = _configuration["SendGrid:FromName"];

        var client = new SendGridClient(apiKey);
        var message = new SendGridMessage();

        message.SetFrom(new EmailAddress(fromEmail, fromName));
        message.AddTo(new EmailAddress(toEmail, toName));
        message.SetSubject(subject);

        message.AddContent(MimeType.Html, htmlBody + $@"
            <p style=""font-size:12px;color:#666;margin-top:24px;"">
              CollectFlowAI<br/>
              To unsubscribe, <a href=""{unsubscribeUrl}"">click here</a>.
            </p>");

        message.AddHeader("List-Unsubscribe", $"<{unsubscribeUrl}>");
        message.AddHeader("List-Unsubscribe-Post", "List-Unsubscribe=One-Click");

        var response = await client.SendEmailAsync(message, cancellationToken);

        var messageId =
            response.Headers.TryGetValues("X-Message-Id", out var values)
                ? values.FirstOrDefault() ?? ""
                : "";

        return messageId;
    }
}