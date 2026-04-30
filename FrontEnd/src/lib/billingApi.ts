import { getToken } from './auth';
import type { BillingSummary } from '../types/billing';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7001';

export async function getBillingSummary(): Promise<BillingSummary> {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/api/billing/summary`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Could not load billing summary.');
  }

  return response.json();
}
export async function startStripeCheckout(): Promise<void> {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/api/billing/create-checkout-session`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) throw new Error('Could not start checkout.');

  const data = await response.json();
  window.location.href = data.url;
}