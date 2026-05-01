import { getToken } from './auth';
import type { RecoverySummary } from '../types/report';
import type { SalesFunnelDailyTrend } from '../types/sales';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is required');
}

export async function getRecoverySummary(): Promise<RecoverySummary> {
 // const token = getToken();

  const res = await fetch(`${API_BASE_URL}/api/reports/recovery-summary`, {
    credentials: 'include', // 👈 REQUIRED 
  });

  if (!res.ok) throw new Error('Failed to load report');

  return res.json();
}
export async function getSalesFunnel() {
  const res = await fetch(`${API_BASE_URL}/api/reports/sales-funnel`, {
    credentials: 'include', // 👈 REQUIRED 
  });

  if (!res.ok) throw new Error('Failed to load funnel');

  return res.json();
}

export async function getSalesFunnelDailyTrend(): Promise<SalesFunnelDailyTrend[]> {
  const res = await fetch(`${API_BASE_URL}/api/reports/sales-funnel/daily-trend`, {
    credentials: 'include', // 👈 REQUIRED 
  });

  if (!res.ok) throw new Error('Failed to load daily trend');

  return res.json();
}