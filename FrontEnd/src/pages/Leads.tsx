import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { getLeads } from '../lib/api';
import { formatDate, normalizeStatus } from '../lib/format';
import type { Lead } from '../types';

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    getLeads().then(setLeads).catch((err) => setError(err instanceof Error ? err.message : 'Could not load leads.')).finally(() => setLoading(false));
  }, []);

  const filteredLeads = useMemo(() => statusFilter === 'All' ? leads : leads.filter((lead) => normalizeStatus(lead.status) === statusFilter), [leads, statusFilter]);
  const metrics = useMemo(() => ({
    total: leads.length,
    newCount: leads.filter((x) => normalizeStatus(x.status) === 'New').length,
    qualified: leads.filter((x) => normalizeStatus(x.status) === 'Qualified').length,
    won: leads.filter((x) => normalizeStatus(x.status) === 'Won').length
  }), [leads]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div><p className="text-sm font-medium uppercase tracking-wide text-slate-500">Leads Admin</p><h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">Demo request pipeline</h1></div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm">
            {['All', 'New', 'Contacted', 'Qualified', 'DemoScheduled', 'ProposalSent', 'Won', 'Lost'].map((status) => <option key={status}>{status}</option>)}
          </select>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {[['Total Leads', metrics.total], ['New', metrics.newCount], ['Qualified', metrics.qualified], ['Won', metrics.won]].map(([label, value]) => (
            <div key={label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="text-sm text-slate-500">{label}</div><div className="mt-3 text-3xl font-semibold">{value}</div></div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Leads</h2><button type="button" onClick={() => window.location.reload()} className="rounded-2xl border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">Refresh</button></div>
          {loading ? <p className="mt-6 text-slate-600">Loading leads...</p> : null}
          {error ? <p className="mt-6 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p> : null}
          {!loading && !error ? (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-slate-500"><tr><th className="py-3">Company</th><th>Name</th><th>Email</th><th>Status</th><th>Created</th><th></th></tr></thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-slate-100">
                      <td className="py-4 font-medium">{lead.company}</td><td>{lead.name}</td><td>{lead.email}</td>
                      <td><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">{normalizeStatus(lead.status)}</span></td>
                      <td>{formatDate(lead.createdAtUtc)}</td>
                      <td className="text-right"><Link to={`/leads/${lead.id}`} className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-medium text-white">View</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredLeads.length === 0 ? <p className="py-10 text-center text-slate-500">No leads found.</p> : null}
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
