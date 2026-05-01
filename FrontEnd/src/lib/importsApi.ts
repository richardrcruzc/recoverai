import { getToken } from './auth';
import type { ImportInvoicesResponse } from '../types/imports';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is required');
}

export async function importInvoicesCsv(file: File): Promise<ImportInvoicesResponse> {
  const token = getToken();
  const formData = new FormData();

  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/imports/invoices`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: formData
  });

  if (!response.ok) {
    let message = `Import failed with status ${response.status}`;

    try {
      const data = await response.json();
      message = data.message ?? message;
    } catch {
      // ignore
    }

    throw new Error(message);
  }

  return response.json();
}