import { getToken } from './auth';
import type { Lead, LeadFormValues } from '../types';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7001';

async function request<T>(path: string, options?: RequestInit & { authenticated?: boolean }): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (options?.headers) {
    Object.assign(headers, options.headers as Record<string, string>);
  }

  if (options?.authenticated !== false && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  if (response.status === 401) {
    localStorage.removeItem('collectflowai_access_token');
    localStorage.removeItem('collectflowai_user');
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const data = await response.json();
      message = data.message ?? message;
    } catch {
      // ignore parse error
    }
    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}

export async function submitLead(values: LeadFormValues): Promise<Lead> {
  return request<Lead>('/api/leads', {
    method: 'POST',
    authenticated: false,
    body: JSON.stringify(values)
  });
}

export async function getLeads(): Promise<Lead[]> {
  return request<Lead[]>('/api/leads');
}

export async function updateLeadStatus(id: string, status: string): Promise<void> {
  await request<void>(`/api/leads/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
}
