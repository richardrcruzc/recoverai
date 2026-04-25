import { getToken } from './auth';
import type { InvoiceScore, RunScoringResponse } from '../types/scoring';

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

export async function runScoring(): Promise<RunScoringResponse> {
  return request<RunScoringResponse>('/api/scoring/run', {
    method: 'POST'
  });
}

export async function getScores(): Promise<InvoiceScore[]> {
  return request<InvoiceScore[]>('/api/scoring');
}