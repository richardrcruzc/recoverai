import { getToken } from './auth';
import type { CreatePaymentRequest, Payment } from '../types/payment';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is required');
}

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
      // ignore
    }
    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function getPayments(): Promise<Payment[]> {
  return request<Payment[]>('/api/payments');
}

export async function getPaymentsByInvoice(invoiceId: string): Promise<Payment[]> {
  return request<Payment[]>(`/api/payments/invoice/${invoiceId}`);
}

export async function createPayment(input: CreatePaymentRequest): Promise<Payment> {
  return request<Payment>('/api/payments', {
    method: 'POST',
    body: JSON.stringify(input)
  });
}