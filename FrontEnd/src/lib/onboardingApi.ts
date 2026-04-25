import type { TenantOnboardingRequest, TenantOnboardingResponse } from '../types/onboarding';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7001';

export async function createTenantOnboarding(
  input: TenantOnboardingRequest
): Promise<TenantOnboardingResponse> {
  const response = await fetch(`${API_BASE_URL}/api/onboarding/tenant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const data = await response.json();
      message = data.message ?? message;
    } catch {
      // ignore
    }

    throw new Error(message);
  }

  return response.json();
}