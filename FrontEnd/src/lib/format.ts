export function formatDate(value?: string): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export function normalizeStatus(status: string | number): string {
  if (typeof status === 'string') return status;
  const map: Record<number, string> = {
    1: 'New',
    2: 'Contacted',
    3: 'Qualified',
    4: 'DemoScheduled',
    5: 'ProposalSent',
    6: 'Won',
    7: 'Lost'
  };
  return map[status] ?? 'New';
}
