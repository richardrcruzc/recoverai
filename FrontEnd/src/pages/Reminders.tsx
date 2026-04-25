import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import { getReminderLogs, runReminders } from '../lib/remindersApi';
import type { ReminderLog, RunReminderResponse } from '../types/reminder';

function normalizeStatus(status: string | number): string {
  if (typeof status === 'string') return status;

  const map: Record<number, string> = {
    1: 'Pending',
    2: 'Sent',
    3: 'Failed',
    4: 'Skipped'
  };

  return map[status] ?? 'Pending';
}

function formatDate(value?: string | null): string {
  if (!value) return '—';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
}

function statusClass(status: string | number): string {
  const value = normalizeStatus(status);

  if (value === 'Sent') return 'bg-emerald-50 text-emerald-700';
  if (value === 'Failed') return 'bg-rose-50 text-rose-700';
  if (value === 'Skipped') return 'bg-amber-50 text-amber-700';

  return 'bg-slate-100 text-slate-700';
}

export default function Reminders() {
  const [logs, setLogs] = useState<ReminderLog[]>([]);
  const [minimumDaysOverdue, setMinimumDaysOverdue] = useState(1);
  const [sendEmails, setSendEmails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunReminderResponse | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const metrics = useMemo(() => {
    return {
      total: logs.length,
      sent: logs.filter((x) => normalizeStatus(x.status) === 'Sent').length,
      failed: logs.filter((x) => normalizeStatus(x.status) === 'Failed').length,
      skipped: logs.filter((x) => normalizeStatus(x.status) === 'Skipped').length
    };
  }, [logs]);

  const loadLogs = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getReminderLogs();
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load reminder logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadLogs();
  }, []);

  const handleRun = async () => {
    setRunning(true);
    setError('');
    setMessage('');
    setResult(null);

    try {
      const response = await runReminders({
        minimumDaysOverdue,
        sendEmails
      });

      setResult(response);
      setMessage('Reminder engine completed.');
      await loadLogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not run reminders.');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Automation Module</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">Reminders</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Run overdue invoice reminders manually, verify logs, and monitor sent, failed, or skipped messages.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {[
            ['Reminder Logs', metrics.total],
            ['Sent', metrics.sent],
            ['Failed', metrics.failed],
            ['Skipped', metrics.skipped]
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm text-slate-500">{label}</div>
              <div className="mt-3 text-3xl font-semibold">{value}</div>
            </div>
          ))}
        </div>

        <section className="mt-8 grid gap-8 lg:grid-cols-[420px_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Run Reminder Engine</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Use test mode first with email sending disabled. After SMTP is confirmed, enable email sending.
            </p>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Minimum days overdue
                </span>
                <input
                  type="number"
                  min={1}
                  value={minimumDaysOverdue}
                  onChange={(e) => setMinimumDaysOverdue(Number(e.target.value))}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </label>

              <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <div className="text-sm font-medium text-slate-900">Send real emails</div>
                  <div className="text-xs text-slate-500">
                    Keep disabled while testing.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={sendEmails}
                  onChange={(e) => setSendEmails(e.target.checked)}
                  className="h-5 w-5"
                />
              </label>

              <button
                type="button"
                onClick={handleRun}
                disabled={running}
                className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {running ? 'Running...' : 'Run Reminders Now'}
              </button>

              <button
                type="button"
                onClick={loadLogs}
                className="w-full rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium transition hover:bg-slate-50"
              >
                Refresh Logs
              </button>
            </div>

            {message ? (
              <p className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">{message}</p>
            ) : null}

            {error ? (
              <p className="mt-5 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>
            ) : null}

            {result ? (
              <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <div className="font-medium text-slate-900">Last run summary</div>
                <div className="mt-2 grid gap-2">
                  <div>Evaluated invoices: {result.evaluatedInvoices}</div>
                  <div>Reminders created: {result.remindersCreated}</div>
                  <div>Reminders sent: {result.remindersSent}</div>
                  <div>Reminders failed: {result.remindersFailed}</div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-xl font-semibold">Reminder Logs</h2>
              <p className="mt-1 text-sm text-slate-500">
                Shows reminders created by manual runs and scheduled Hangfire jobs.
              </p>
            </div>

            {loading ? (
              <p className="mt-6 text-slate-600">Loading reminder logs...</p>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="py-3">Invoice</th>
                      <th>Customer</th>
                      <th>Email</th>
                      <th>Channel</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Sent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} className="border-b border-slate-100 align-top">
                        <td className="py-4 font-medium">{log.invoiceNumber}</td>
                        <td>{log.customerName}</td>
                        <td>{log.customerEmail || '—'}</td>
                        <td>{log.channel}</td>
                        <td>
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass(log.status)}`}>
                            {normalizeStatus(log.status)}
                          </span>
                          {log.errorMessage ? (
                            <div className="mt-2 max-w-xs text-xs text-rose-600">
                              {log.errorMessage}
                            </div>
                          ) : null}
                        </td>
                        <td>{formatDate(log.createdAtUtc)}</td>
                        <td>{formatDate(log.sentAtUtc)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {logs.length === 0 ? (
                  <p className="py-10 text-center text-slate-500">No reminder logs found.</p>
                ) : null}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}