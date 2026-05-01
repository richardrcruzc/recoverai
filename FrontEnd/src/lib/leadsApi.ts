import type { Lead } from '../types/lead';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is required');
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  
  const response = await fetch(`${API_BASE_URL}${path}`,  {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json'
    }
  });

  if (response.status === 401) {
    localStorage.removeItem('recoverai_access_token');
    localStorage.removeItem('recoverai_user');
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }

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

  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}

export async function getLeads(): Promise<Lead[]> {
  return request<Lead[]>('/api/leads', {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json'
    }
  });
}

export async function updateLeadStage(leadId: string, stage: number): Promise<void> {
  await request<void>(`/api/leads/${leadId}/stage`, {
    method: 'PATCH',
      credentials: 'include', // 👈 REQUIRED
    body: JSON.stringify({ stage })
  });
}

export async function addLeadNote(leadId: string, note: string): Promise<void> {
  await request<void>(`/api/leads/${leadId}/note`, {
    method: 'PATCH',
      credentials: 'include', // 👈 REQUIRED
    body: JSON.stringify(note)
  });
}