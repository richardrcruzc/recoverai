import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import { getOutboundContacts, getOutboundEmailSends, sendOutboundCampaign } from '../lib/outboundApi';
import type { OutboundContact, OutboundEmailSend } from '../types/outbound';

function formatDate(value?: string | null): string {
  if (!value) return '—';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
}

export default function Outbound() {
  const [contacts, setContacts] = useState<OutboundContact[]>([]);
  const [sends, setSends] = useState<OutboundEmailSend[]>([]);
  const [campaignId, setCampaignId] = useState('');
  const [limit, setLimit] = useState(25);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const metrics = useMemo(() => {
    return {
      contacts: contacts.length,
      contacted: contacts.filter((x) => x.status === 'Contacted').length,
      unsubscribed: contacts.filter((x) => x.isUnsubscribed).length,
      sent: sends.length,
      opened: sends.filter((x) => x.openedAtUtc).length,
      clicked: sends.filter((x) => x.clickedAtUtc).length,
      bounced: sends.filter((x) => x.bouncedAtUtc).length
    };
  }, [contacts, sends]);

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const [contactData, sendData] = await Promise.all([
        getOutboundContacts(),
        getOutboundEmailSends()
      ]);

      setContacts(contactData);
      setSends(sendData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load outbound data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleSend = async () => {
    setSending(true);
    setError('');
    setMessage('');

    if (!campaignId.trim()) {
      setError('Campaign Id is required.');
      setSending(false);
      return;
    }

    try {
      const result = await sendOutboundCampaign(campaignId.trim(), limit);
      setMessage(`Campaign sent to ${result.sent} contacts.`);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send campaign.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              Growth System
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Outbound Email Tracking
            </h1>

            <p className="mt-3 max-w-2xl text-slate-600">
              Track contacts, campaign sends, opens, clicks, bounces, and unsubscribes.
            </p>
          </div>

          <button
            type="button"
            onClick={loadData}
            className="w-full rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium transition hover:bg-slate-50 sm:w-auto"
          >
            Refresh
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ['Contacts', metrics.contacts],
            ['Contacted', metrics.contacted],
            ['Sent Emails', metrics.sent],
            ['Opened', metrics.opened],
            ['Clicked', metrics.clicked],
            ['Bounced', metrics.bounced],
            ['Unsubscribed', metrics.unsubscribed]
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="text-sm text-slate-500">{label}</div>
              <div className="mt-3 text-2xl font-semibold sm:text-3xl">{value}</div>
            </div>
          ))}
        </div>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-xl font-semibold">Send Campaign.</h2>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-[1fr_160px_auto]">
            <input
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              placeholder="Campaign Id"
              className="rounded-2xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />

            <input
              type="number"
              min={1}
              max={100}
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="rounded-2xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />

            <button
              type="button"
              onClick={handleSend}
              disabled={sending}
              className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-medium text-white disabled:opacity-60"
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </div>

          {message ? (
            <p className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">
              {message}
            </p>
          ) : null}

          {error ? (
            <p className="mt-5 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
              {error}
            </p>
          ) : null}
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-xl font-semibold">Recent Sends</h2>

          {loading ? (
            <p className="mt-6 text-slate-600">Loading outbound data...</p>
          ) : (
            <div className="mt-6 w-full overflow-x-auto rounded-2xl">
              <table className="min-w-[1100px] w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="py-3">Company</th>
                    <th>Contact</th>
                    <th>Email</th>
                    <th>Campaign</th>
                    <th>Status</th>
                    <th>Last Event</th>
                    <th>Sent</th>
                    <th>Opened</th>
                    <th>Clicked</th>
                    <th>Bounced</th>
                  </tr>
                </thead>

                <tbody>
                  {sends.map((send) => (
                    <tr key={send.id} className="border-b border-slate-100">
                      <td className="py-4 font-medium">{send.companyName}</td>
                      <td>{send.contactName}</td>
                      <td>{send.email}</td>
                      <td>{send.campaignName}</td>
                      <td>{send.status}</td>
                      <td>{send.lastEvent || '—'}</td>
                      <td>{formatDate(send.sentAtUtc)}</td>
                      <td>{formatDate(send.openedAtUtc)}</td>
                      <td>{formatDate(send.clickedAtUtc)}</td>
                      <td>{formatDate(send.bouncedAtUtc)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {sends.length === 0 ? (
                <p className="py-10 text-center text-slate-500">
                  No email sends found.
                </p>
              ) : null}
            </div>
          )}
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-xl font-semibold">Contacts</h2>

          <div className="mt-6 w-full overflow-x-auto rounded-2xl">
            <table className="min-w-[1000px] w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-3">Company</th>
                  <th>Industry</th>
                  <th>Contact</th>
                  <th>Title</th>
                  <th>Email</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Unsubscribed</th>
                </tr>
              </thead>

              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.id} className="border-b border-slate-100">
                    <td className="py-4 font-medium">{contact.companyName}</td>
                    <td>{contact.industry}</td>
                    <td>{contact.contactName}</td>
                    <td>{contact.title}</td>
                    <td>{contact.email}</td>
                    <td>{contact.score}</td>
                    <td>{contact.status}</td>
                    <td>{contact.isUnsubscribed ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {contacts.length === 0 ? (
              <p className="py-10 text-center text-slate-500">
                No contacts found.
              </p>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}