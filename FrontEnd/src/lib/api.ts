import { supabase } from '@/lib/supabase';
import type { LeadFormValues } from '@/lib/types';

export async function submitLead(values: LeadFormValues) {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }

  const payload = {
    name: values.name,
    email: values.email,
    phone: values.phone || null,
    company: values.company,
    invoice_volume: values.invoiceVolume,
    biggest_problem: values.biggestProblem,
    source: 'recoverai-landing-page',
  };

  const { error } = await supabase.from('leads').insert(payload);
  if (error) throw error;

  const webhookUrl = import.meta.env.VITE_LEAD_NOTIFICATION_WEBHOOK_URL as string | undefined;
  if (webhookUrl) {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  }
}
