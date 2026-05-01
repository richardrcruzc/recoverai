import { getToken } from './auth';
import type { ReminderLog, RunReminderRequest, RunReminderResponse } from '../types/reminder';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is required');
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}${path}`,  {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json'
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

export async function runReminders(input: RunReminderRequest): Promise<RunReminderResponse> {
  return request<RunReminderResponse>('/api/reminders/run', {
    method: 'POST',
    credentials: 'include', // 👈 REQUIRED
    body: JSON.stringify(input)
  });
}

export async function getReminderLogs(): Promise<ReminderLog[]> {
  return request<ReminderLog[]>('/api/reminders/logs',  {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json'
    }
  });
}