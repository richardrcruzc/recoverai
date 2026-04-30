import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import { getLeads, updateLeadStage, addLeadNote } from '../lib/leadsApi';
import type { Lead, LeadStage } from '../types/lead';

const stages: { value: number; label: string }[] = [
  { value: 1, label: 'New' },
  { value: 2, label: 'Contacted' },
  { value: 3, label: 'Replied' },
  { value: 4, label: 'Demo Scheduled' },
  { value: 5, label: 'Activated' },
  { value: 6, label: 'Paying Customer' },
  { value: 7, label: 'Lost' }
];

function normalizeStage(stage: LeadStage): number {
  if (typeof stage === 'number') return stage;

  const map: Record<string, number> = {
    New: 1,
    Contacted: 2,
    Replied: 3,
    DemoScheduled: 4,
    PayingCustomer: 6,
    Activated: 5,
    Lost: 7
  };

  return map[String(stage)] ?? 1;
}

function formatDate(value?: string | null) {
  if (!value) return '—';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
}

export default function LeadsPipeline() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [notesByLead, setNotesByLead] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  const metrics = useMemo(() => {
    return {
      total: leads.length,
      replied: leads.filter((x) => normalizeStage(x.stage) >= 3).length,
      demos: leads.filter((x) => normalizeStage(x.stage) >= 4).length,
      paying: leads.filter((x) => normalizeStage(x.stage) === 6).length
    };
  }, [leads]);

  const loadLeads = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getLeads();
      setLeads(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load leads.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadLeads();
  }, []);

 const handleStageChange = async (leadId: string, stage: number) => {
  setSavingId(leadId);
  setError('');

  // optimistic update (instant UI move)
  setLeads((current) =>
    current.map((lead) =>
      lead.id === leadId ? { ...lead, stage } : lead
    )
  );

  try {
    await updateLeadStage(leadId, stage);
    // ❌ DO NOT call loadLeads() here
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Could not update lead stage.');

    // rollback if failed
    await loadLeads();
  } finally {
    setSavingId(null);
  }
};

 const handleAddNote = async (leadId: string) => {
  const note = notesByLead[leadId]?.trim();
  if (!note) return;

  setSavingId(leadId);

  try {
    await addLeadNote(leadId, note);

    setLeads((current) =>
      current.map((lead) =>
        lead.id === leadId
          ? { ...lead, notes: (lead.notes || '') + '\n\n' + note }
          : lead
      )
    );

    setNotesByLead((c) => ({ ...c, [leadId]: '' }));
  } catch {
    await loadLeads();
  } finally {
    setSavingId(null);
  }
};

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              CRM Pipeline
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Leads Pipeline
            </h1>

            <p className="mt-3 max-w-2xl text-slate-600">
              Move leads from outreach to replies, demos, activation, and paying customers.
            </p>
          </div>

          <button
            type="button"
            onClick={loadLeads}
            className="w-full rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium transition hover:bg-slate-50 sm:w-auto"
          >
            Refresh
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card label="Total Leads" value={metrics.total} />
          <Card label="Replied" value={metrics.replied} />
          <Card label="Demo or Better" value={metrics.demos} />
          <Card label="Paying Customers" value={metrics.paying} />
        </div>

        {error ? (
          <p className="mt-6 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        {loading ? (
          <p className="mt-8 text-slate-600">Loading leads...</p>
        ) : (
          <section className="mt-8">
            <div className="flex gap-4 overflow-x-auto pb-4">
              {stages.map((stage) => {
                const stageLeads = leads.filter((lead) => normalizeStage(lead.stage) === stage.value);

                return (
                  <div
                    key={stage.value}
                    className="min-w-[300px] max-w-[300px] rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                        {stage.label}
                      </h2>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        {stageLeads.length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {stageLeads.map((lead) => (
                        <div
                          key={lead.id}
                          className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                        >
                          <div className="font-semibold text-slate-900">
                            {lead.name || lead.company || 'Unnamed Lead'}
                          </div>

                          {lead.company ? (
                            <div className="mt-1 text-sm text-slate-600">{lead.company}</div>
                          ) : null}

                          <div className="mt-1 break-all text-sm text-slate-500">
                            {lead.email}
                          </div>

                          <div className="mt-3 text-xs text-slate-500">
                            Last contacted: {formatDate(lead.lastContactedAtUtc)}
                          </div>

                          <div className="mt-1 text-xs text-slate-500">
                            Last replied: {formatDate(lead.lastRepliedAtUtc)}
                          </div>

                          <label className="mt-4 block">
                            <span className="mb-1 block text-xs font-medium text-slate-600">
                              Stage
                            </span>

                            <select
                              value={normalizeStage(lead.stage)}
                              disabled={savingId === lead.id}
                              onChange={(e) => handleStageChange(lead.id, Number(e.target.value))}
                              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                            >
                              {stages.map((item) => (
                                <option key={item.value} value={item.value}>
                                  {item.label}
                                </option>
                              ))}
                            </select>
                          </label>

                          <label className="mt-3 block">
                            <span className="mb-1 block text-xs font-medium text-slate-600">
                              Add note
                            </span>

                            <textarea
                              value={notesByLead[lead.id] || ''}
                              onChange={(e) =>
                                setNotesByLead((current) => ({
                                  ...current,
                                  [lead.id]: e.target.value
                                }))
                              }
                              placeholder="Follow-up notes..."
                              className="min-h-[80px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                            />
                          </label>

                          <button
                            type="button"
                            disabled={savingId === lead.id || !notesByLead[lead.id]?.trim()}
                            onClick={() => handleAddNote(lead.id)}
                            className="mt-2 w-full rounded-xl bg-slate-900 px-3 py-2 text-xs font-medium text-white disabled:opacity-50"
                          >
                            {savingId === lead.id ? 'Saving...' : 'Save Note'}
                          </button>

                          {lead.notes ? (
                            <div className="mt-3 max-h-28 overflow-y-auto whitespace-pre-wrap rounded-xl bg-white p-3 text-xs text-slate-600">
                              {lead.notes}
                            </div>
                          ) : null}
                        </div>
                      ))}

                      {stageLeads.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">
                          No leads
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function Card({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-3 text-2xl font-semibold sm:text-3xl">{value}</div>
    </div>
  );
}