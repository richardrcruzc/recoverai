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