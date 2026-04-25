namespace CollectFlow.Application.Interfaces;

public interface IAuthService
{
    Task<(bool Success, string Email, string Role)> ValidateCredentialsAsync(string email, string password, CancellationToken cancellationToken = default);
}
