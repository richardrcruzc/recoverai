import type { LeadFormValues } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is required');
}

export async function submitLead(values: LeadFormValues): Promise<void> {
  if (!API_BASE_URL) {
    saveLocalLead(values);
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/leads`, {
      method: 'POST',
      credentials: 'include', // 👈 REQUIRED
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });

    if (!response.ok) {
      throw new Error('Lead API request failed.');
    }
  } catch {
    saveLocalLead(values);
  }
}

function saveLocalLead(values: LeadFormValues): void {
  const record = {
    ...values,
    id: crypto.randomUUID(),
    createdAtUtc: new Date().toISOString(),
    source: 'collectflowai-react-vite'
  };

  const existing = localStorage.getItem('collectflowai_leads');
  const leads = existing ? JSON.parse(existing) : [];
  localStorage.setItem('collectflowai_leads', JSON.stringify([record, ...leads]));
}
