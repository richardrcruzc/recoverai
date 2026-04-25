import type { LeadFormValues } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function submitLead(values: LeadFormValues): Promise<void> {
  if (!API_BASE_URL) {
    saveLocalLead(values);
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/leads`, {
      method: 'POST',
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
    source: 'recoverai-react-vite'
  };

  const existing = localStorage.getItem('recoverai-leads');
  const leads = existing ? JSON.parse(existing) : [];
  localStorage.setItem('recoverai-leads', JSON.stringify([record, ...leads]));
}
