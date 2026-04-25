import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import { getLeads, updateLeadStatus } from '../lib/api';
import { formatDate, normalizeStatus } from '../lib/format';
import type { Lead } from '../types';

const statuses = ['New', 'Contacted', 'Qualified', 'DemoScheduled', 'ProposalSent', 'Won', 'Lost'];

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => { getLeads().then(setLeads).finally(() => setLoading(false)); }, []);
  const lead = useMemo(() => leads.find((x) => x.id === id), [leads, id]);
  const [status, setStatus] = useState('New');
  useEffect(() => { if (lead) setStatus(normalizeStatus(lead.status)); }, [lead]);

  const saveStatus = async () => {
    if (!lead) return;
    setSaving(true); setMessage('');
    try { await updateLeadStatus(lead.id, status); setMessage('Status updated.'); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Could not update status.'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="min-h-screen bg-slate-50 text-slate-900"><Header /><main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">Loading lead...</main></div>;
  if (!lead) return <div className="min-h-screen bg-slate-50 text-slate-900"><Header /><main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10"><p>Lead not found.</p><button onClick={() => navigate('/leads')} className="mt-4 rounded-2xl bg-slate-900 px-5 py-3 text-sm text-white">Back to Leads</button></main></div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <Link to="/leads" className="text-sm text-slate-600 hover:text-slate-900">← Back to leads</Link>
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col justify-between gap-6 md:flex-row">
            <div><p className="text-sm font-medium uppercase tracking-wide text-slate-500">Lead Detail</p><h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">{lead.company}</h1><p className="mt-3 text-slate-600">{lead.name} · {lead.email}</p></div>
            <div className="min-w-[260px] rounded-3xl bg-slate-50 p-5">
              <label className="text-sm font-medium text-slate-600">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm">{statuses.map((item) => <option key={item}>{item}</option>)}</select>
              <button type="button" onClick={saveStatus} disabled={saving} className="mt-4 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-60">{saving ? 'Saving...' : 'Save Status'}</button>
              {message ? <p className="mt-3 text-sm text-slate-600">{message}</p> : null}
            </div>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Info label="Phone" value={lead.phone || '—'} /><Info label="Invoice Volume" value={lead.invoiceVolume} /><Info label="Source" value={lead.source} /><Info label="Created" value={formatDate(lead.createdAtUtc)} />
          </div>
          <div className="mt-8 rounded-3xl bg-slate-50 p-6"><div className="text-sm font-medium text-slate-500">Biggest collections problem</div><p className="mt-3 leading-7 text-slate-700">{lead.biggestProblem}</p></div>
          <div className="mt-8 flex flex-wrap gap-3"><a href={`mailto:${lead.email}`} className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium hover:bg-slate-50">Email Lead</a><a href={`tel:${lead.phone}`} className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium hover:bg-slate-50">Call Lead</a></div>
        </div>
      </main>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-3xl border border-slate-200 p-5"><div className="text-sm font-medium text-slate-500">{label}</div><div className="mt-2 font-semibold">{value}</div></div>;
}
