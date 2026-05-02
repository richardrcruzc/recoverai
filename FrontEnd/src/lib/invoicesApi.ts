import { getToken } from './auth';
import type { CreateInvoiceRequest, Invoice } from '../types/invoice';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is required');
}
async function request<T>(path: string, options?: RequestInit): Promise<T> {
 // const token = getToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {})
    }
  });

  if (response.status === 401) { 
    sessionStorage.removeItem('collectflowai_user');
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

export async function getInvoices(status?: string): Promise<Invoice[]> {
  const query = status && status !== 'All' ? `?status=${encodeURIComponent(status)}` : '';
  console.log(`Request: ${status || 'All'}`);
  return request<Invoice[]>(`/api/invoices${query}` );
}

export async function createInvoice(input: CreateInvoiceRequest): Promise<Invoice> {
  return request<Invoice>('/api/invoices', {
    method: 'POST', 
     credentials: 'include', // 👈 REQUIRED
    body: JSON.stringify(input)
  });
}

export async function updateInvoiceStatus(id: string, status: string): Promise<Invoice> {
  console.log(`Updating invoice ${id} status to ${status}`);
  return request<Invoice>(`/api/invoices/${id}/status`, {
    method: 'PATCH', 
      credentials: 'include', // 👈 REQUIRED
    body: JSON.stringify({ status: Number(status) })
  });
}
