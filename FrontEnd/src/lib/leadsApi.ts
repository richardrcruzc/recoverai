import { getToken } from './auth';
import type { Lead } from '../types/lead';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7001';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers ?? {})
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
  return request<Lead[]>('/api/leads');
}

export async function updateLeadStage(leadId: string, stage: number): Promise<void> {
  await request<void>(`/api/leads/${leadId}/stage`, {
    method: 'PATCH',
    body: JSON.stringify(stage)
  });
}

export async function addLeadNote(leadId: string, note: string): Promise<void> {
  await request<void>(`/api/leads/${leadId}/note`, {
    method: 'PATCH',
    body: JSON.stringify(note)
  });
}