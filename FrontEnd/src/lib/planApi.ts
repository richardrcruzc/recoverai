import type { PlanLimits } from '../types/plan';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is required');
}

export async function getPlanLimits(): Promise<PlanLimits> {
  const response = await fetch(`${API_BASE_URL}/api/plan/limits`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json'
    }
  }); 
  
  if (response.status === 401) {
    sessionStorage.removeItem('collectflowai_user');
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }

  if (!response.ok) {
    throw new Error('Could not load plan limits.');
  }

  return response.json() as Promise<PlanLimits>;
}