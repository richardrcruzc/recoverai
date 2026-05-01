import { getToken } from './auth'; 
import type {
  EmailAutomationJob,
  RunEmailAutomationResponse,
  QueueLeadBatchResponse
} from '../types/emailAutomation';

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

export async function getEmailAutomationJobs(): Promise<EmailAutomationJob[]> {
  return request<EmailAutomationJob[]>('/api/email-automation/jobs', {
    credentials: 'include' // 👈 REQUIRED
  });
}

export async function runEmailAutomation(): Promise<RunEmailAutomationResponse> {
  return request<RunEmailAutomationResponse>('/api/email-automation/run', {
    method: 'POST',
     credentials: 'include', // 👈 REQUIRED
  });

}

export async function queueAllLeads(): Promise<{ queued: number }> {
  return request<{ queued: number }>('/api/email-automation/queue-all-leads', {
    method: 'POST',
     credentials: 'include', // 👈 REQUIRED
  });
}

export async function queueLeadBatch(batchSize = 50): Promise<QueueLeadBatchResponse> {
  return request<QueueLeadBatchResponse>('/api/email-automation/queue-lead-batch', {
    method: 'POST',
      credentials: 'include', // 👈 REQUIRED
    body: JSON.stringify({ batchSize })
  });
}