import { getToken } from './auth';
import type { CollectionAction, RunCollectionsEngineResponse } from '../types/collections';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is required');
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
     credentials: 'include', // 👈 REQUIRED
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers ?? {})
    }
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
      // ignore
    }

    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function runCollectionsEngine(): Promise<RunCollectionsEngineResponse> {
  return request<RunCollectionsEngineResponse>('/api/collections/run', {
    method: 'POST',
     credentials: 'include', // 👈 REQUIRED
  });
}

export async function getCollectionActions(): Promise<CollectionAction[]> {
  return request<CollectionAction[]>('/api/collections/actions');
}

export async function completeCollectionAction(id: string, notes: string): Promise<void> {
  await request<void>(`/api/collections/actions/${id}/complete`, {
    method: 'PATCH',
     credentials: 'include', // 👈 REQUIRED
    body: JSON.stringify({ notes })
  });
}