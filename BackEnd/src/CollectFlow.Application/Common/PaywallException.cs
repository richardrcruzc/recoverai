namespace CollectFlow.Application.Common;

public class PaywallException : Exception
{
    public string Feature { get; }

    public PaywallException(string feature, string message) : base(message)
    {
        Feature = feature;
    }
}