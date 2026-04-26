export function isPaywallError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  return (
    error.message.toLowerCase().includes('free plan limit') ||
    error.message.toLowerCase().includes('upgrade')
  );
}