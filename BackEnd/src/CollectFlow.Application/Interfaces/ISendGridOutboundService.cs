public interface ISendGridOutboundService
{
    Task<string> SendOutboundAsync(
        string toEmail,
        string toName,
        string subject,
        string htmlBody,
        string unsubscribeUrl,
        CancellationToken cancellationToken = default);
}