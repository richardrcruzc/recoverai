import type { Lead, LeadFormValues } from '../types';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7001';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) }
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const data = await response.json();
      message = data.message ?? message;
    } catch {}
    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function submitLead(values: LeadFormValues): Promise<Lead> {
  return request<Lead>('/api/leads', { method: 'POST', body: JSON.stringify(values) });
}

export async function getLeads(): Promise<Lead[]> {
  return request<Lead[]>('/api/leads');
}

export async function updateLeadStatus(id: string, status: string): Promise<void> {
  await request<void>(`/api/leads/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
}
