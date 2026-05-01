import { getToken } from './auth';
import type { OutboundContact, OutboundEmailSend, SendCampaignResponse } from '../types/outbound';

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

export async function getOutboundContacts(): Promise<OutboundContact[]> {
  return request<OutboundContact[]>('/api/outbound/contacts', {
    credentials: 'include' // 👈 REQUIRED
  } );
}

export async function getOutboundEmailSends(): Promise<OutboundEmailSend[]> {
  return request<OutboundEmailSend[]>('/api/outbound/sends', {
    credentials: 'include' // 👈 REQUIRED
  });
}

export async function sendOutboundCampaign(campaignId: string, limit = 25): Promise<SendCampaignResponse> {
  console.log(`Sending campaign ${campaignId} with limit ${limit}`);
  return request<SendCampaignResponse>(`/api/outbound/campaigns/${campaignId}/send?limit=${limit}`, {
    method: 'POST',
      credentials: 'include', // 👈 REQUIRED
  });
}