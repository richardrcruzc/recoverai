import { getToken } from './auth';
import type { AdminUser, CreateAdminUserRequest } from '../types/adminUser';

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
      // Ignore invalid JSON response.
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  return request<AdminUser[]>('/api/admin/users');
}

export async function createAdminUser(input: CreateAdminUserRequest): Promise<AdminUser> {
  return request<AdminUser>('/api/admin/users', {
    method: 'POST',
    body: JSON.stringify(input)
  });
}

export async function setAdminUserStatus(id: string, isActive: boolean): Promise<void> {
  await request<void>(`/api/admin/users/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive })
  });
}
