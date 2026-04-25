import { getToken } from './auth';
import type { RecoverySummary } from '../types/report';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7001';

export async function getRecoverySummary(): Promise<RecoverySummary> {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}/api/reports/recovery-summary`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error('Failed to load report');

  return res.json();
}