import { getToken } from './auth';
import type { PlanLimits } from '../types/plan';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is required');
}

export async function getPlanLimits(): Promise<PlanLimits> {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/api/plan/limits`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Could not load plan limits.');
  }

  return response.json();
}