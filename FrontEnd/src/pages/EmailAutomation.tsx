import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import { getEmailAutomationJobs, runEmailAutomation } from '../lib/emailAutomationApi';
import type { EmailAutomationJob, RunEmailAutomationResponse } from '../types/emailAutomation';

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

function statusClass(status: string | number): string {
  const value = normalizeStatus(status);

  if (value === 'Sent') return 'bg-emerald-50 text-emerald-700';
  if (value === 'Failed') return 'bg-rose-50 text-rose-700';
  if (value === 'Skipped') return 'bg-amber-50 text-amber-700';

  return 'bg-slate-100 text-slate-700';
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

export default function EmailAutomation() {
  const [jobs, setJobs] = useState<EmailAutomationJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunEmailAutomationResponse | null>(null);
  const [error, setError] = useState('');

  const metrics = useMemo(() => {
    return {
      total: jobs.length,
      pending: jobs.filter((x) => normalizeStatus(x.status) === 'Pending').length,
      sent: jobs.filter((x) => normalizeStatus(x.status) === 'Sent').length,
      failed: jobs.filter((x) => normalizeStatus(x.status) === 'Failed').length
    };
  }, [jobs]);

  const loadJobs = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getEmailAutomationJobs();
      setJobs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load email jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadJobs();
  }, []);

  const handleRun = async () => {
    setRunning(true);
    setError('');
    setResult(null);

    try {
      const response = await runEmailAutomation();
      setResult(response);
      await loadJobs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not run email automation.');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              Revenue Automation
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Email Automation
            </h1>

            <p className="mt-3 max-w-2xl text-slate-600">
              Automatically nurture leads and follow up with prospects after form submissions.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRun}
            disabled={running}
            className="w-full rounded-2xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60 sm:w-auto"
          >
            {running ? 'Running...' : 'Run Due Emails'}
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ['Total Jobs', metrics.total],
            ['Pending', metrics.pending],
            ['Sent', metrics.sent],
            ['Failed', metrics.failed]
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="text-sm text-slate-500">{label}</div>
              <div className="mt-3 text-2xl font-semibold sm:text-3xl">{value}</div>
            </div>
          ))}
        </div>

        {result ? (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-xl font-semibold">Last run summary</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
              <div>Evaluated: {result.evaluatedJobs}</div>
              <div>Sent: {result.sent}</div>
              <div>Failed: {result.failed}</div>
              <div>Skipped: {result.skipped}</div>
            </div>
          </div>
        ) : null}

        {error ? (
          <p className="mt-6 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>
        ) : null}

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-semibold">Automation Jobs</h2>
              <p className="mt-1 text-sm text-slate-500">
                Lead nurture emails and scheduled campaigns appear here.
              </p>
            </div>

            <button
              type="button"
              onClick={loadJobs}
              className="w-full rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium transition hover:bg-slate-50 sm:w-auto"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="mt-6 text-slate-600">Loading jobs...</p>
          ) : (
            <div className="mt-6 w-full overflow-x-auto rounded-2xl">
              <table className="min-w-[1000px] w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="py-3">Campaign</th>
                    <th>Recipient</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Scheduled</th>
                    <th>Sent</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id} className="border-b border-slate-100 align-top">
                      <td className="py-4 font-medium">{job.campaignKey}</td>
                      <td>{job.recipientName || '—'}</td>
                      <td>{job.recipientEmail}</td>
                      <td className="max-w-xs text-slate-600">{job.subject}</td>
                      <td>{formatDate(job.scheduledForUtc)}</td>
                      <td>{formatDate(job.sentAtUtc)}</td>
                      <td>
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass(job.status)}`}>
                          {normalizeStatus(job.status)}
                        </span>

                        {job.errorMessage ? (
                          <div className="mt-2 max-w-xs text-xs text-rose-600">
                            {job.errorMessage}
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {jobs.length === 0 ? (
                <p className="py-10 text-center text-slate-500">
                  No email automation jobs found.
                </p>
              ) : null}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}