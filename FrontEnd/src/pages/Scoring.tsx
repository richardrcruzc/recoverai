import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import { getScores, runScoring } from '../lib/scoringApi';
import type { InvoiceScore, RunScoringResponse } from '../types/scoring';

function normalizePriority(priority: string | number): string {
  if (typeof priority === 'string') return priority;

  const map: Record<number, string> = {
    1: 'Low',
    2: 'Medium',
    3: 'High',
    4: 'Critical'
  };

  return map[priority] ?? 'Low';
}

function priorityClass(priority: string | number): string {
  const value = normalizePriority(priority);

  if (value === 'Critical') return 'bg-rose-50 text-rose-700';
  if (value === 'High') return 'bg-orange-50 text-orange-700';
  if (value === 'Medium') return 'bg-amber-50 text-amber-700';

  return 'bg-emerald-50 text-emerald-700';
}

function money(value: number): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD'
  }).format(value || 0);
}

export default function Scoring() {
  const [scores, setScores] = useState<InvoiceScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunScoringResponse | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const metrics = useMemo(() => {
    return {
      total: scores.length,
      critical: scores.filter((x) => normalizePriority(x.priority) === 'Critical').length,
      high: scores.filter((x) => normalizePriority(x.priority) === 'High').length,
      balance: scores.reduce((sum, x) => sum + Number(x.balance || 0), 0)
    };
  }, [scores]);

  const loadScores = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getScores();
      setScores(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load scores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadScores();
  }, []);

  const handleRun = async () => {
    setRunning(true);
    setError('');
    setMessage('');
    setResult(null);

    try {
      const response = await runScoring();
      setResult(response);
      setMessage('Scoring completed.');
      await loadScores();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not run scoring.');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">AI Scoring Engine</p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">Collection Priority Queue</h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Prioritize invoices using balance, overdue age, reminders, and payment history.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRun}
            disabled={running}
            className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {running ? 'Scoring...' : 'Run Scoring'}
          </button>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {[
            ['Scored Invoices', metrics.total],
            ['Critical', metrics.critical],
            ['High', metrics.high],
            ['Balance at Risk', money(metrics.balance)]
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm text-slate-500">{label}</div>
              <div className="mt-3 text-3xl font-semibold">{value}</div>
            </div>
          ))}
        </div>

        {message ? (
          <p className="mt-6 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">{message}</p>
        ) : null}

        {error ? (
          <p className="mt-6 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>
        ) : null}

        {result ? (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Last run summary</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div>Evaluated: {result.evaluatedInvoices}</div>
              <div>Created: {result.scoresCreated}</div>
              <div>Updated: {result.scoresUpdated}</div>
            </div>
          </div>
        ) : null}

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-semibold">Priority Queue</h2>
              <p className="mt-1 text-sm text-slate-500">
                Highest-risk invoices appear first.
              </p>
            </div>

            <button
              type="button"
              onClick={loadScores}
              className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium transition hover:bg-slate-50"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="mt-6 text-slate-600">Loading scores...</p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="py-3">Score</th>
                    <th>Priority</th>
                    <th>Invoice</th>
                    <th>Customer</th>
                    <th>Balance</th>
                    <th>Days Overdue</th>
                    <th>Reminders</th>
                    <th>Payments</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((score) => (
                    <tr key={score.id} className="border-b border-slate-100 align-top">
                      <td className="py-4 text-xl font-semibold">{score.score}</td>
                      <td>
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${priorityClass(score.priority)}`}>
                          {normalizePriority(score.priority)}
                        </span>
                      </td>
                      <td className="font-medium">{score.invoiceNumber}</td>
                      <td>{score.customerCompanyName || score.customerName}</td>
                      <td>{money(Number(score.balance))}</td>
                      <td>{score.daysOverdue}</td>
                      <td>{score.reminderCount}</td>
                      <td>{score.paymentCount}</td>
                      <td className="max-w-sm text-slate-600">{score.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {scores.length === 0 ? (
                <p className="py-10 text-center text-slate-500">
                  No scores found. Run scoring to generate the priority queue.
                </p>
              ) : null}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}