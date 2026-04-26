import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import {
  completeCollectionAction,
  getCollectionActions,
  runCollectionsEngine
} from '../lib/collectionsApi';
import type { CollectionAction, RunCollectionsEngineResponse } from '../types/collections';

function normalizeActionType(value: string | number): string {
  if (typeof value === 'string') return value;

  const map: Record<number, string> = {
    1: 'EmailReminder',
    2: 'CallTask',
    3: 'FinalNotice',
    4: 'EscalationReview',
    5: 'Wait'
  };

  return map[value] ?? 'Wait';
}

function normalizeStatus(value: string | number): string {
  if (typeof value === 'string') return value;

  const map: Record<number, string> = {
    1: 'Pending',
    2: 'Completed',
    3: 'Failed',
    4: 'Skipped'
  };

  return map[value] ?? 'Pending';
}

function statusClass(value: string | number): string {
  const status = normalizeStatus(value);

  if (status === 'Completed') return 'bg-emerald-50 text-emerald-700';
  if (status === 'Failed') return 'bg-rose-50 text-rose-700';
  if (status === 'Skipped') return 'bg-amber-50 text-amber-700';

  return 'bg-slate-100 text-slate-700';
}

function actionClass(value: string | number): string {
  const type = normalizeActionType(value);

  if (type === 'EscalationReview') return 'bg-rose-50 text-rose-700';
  if (type === 'FinalNotice') return 'bg-orange-50 text-orange-700';
  if (type === 'CallTask') return 'bg-amber-50 text-amber-700';

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

export default function Collections() {
  const [actions, setActions] = useState<CollectionAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunCollectionsEngineResponse | null>(null);
  const [error, setError] = useState('');
  const [notesByAction, setNotesByAction] = useState<Record<string, string>>({});

  const metrics = useMemo(() => {
    return {
      total: actions.length,
      pending: actions.filter((x) => normalizeStatus(x.status) === 'Pending').length,
      calls: actions.filter((x) => normalizeActionType(x.actionType) === 'CallTask').length,
      escalations: actions.filter((x) => normalizeActionType(x.actionType) === 'EscalationReview').length
    };
  }, [actions]);

  const loadActions = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getCollectionActions();
      setActions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load collection actions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadActions();
  }, []);

  const handleRun = async () => {
    setRunning(true);
    setResult(null);
    setError('');

    try {
      const response = await runCollectionsEngine();
      setResult(response);
      await loadActions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not run collections engine.');
    } finally {
      setRunning(false);
    }
  };

  const handleComplete = async (actionId: string) => {
    setError('');

    try {
      await completeCollectionAction(actionId, notesByAction[actionId] || '');
      await loadActions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not complete action.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              Collections Engine
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Automated Collection Workflow
            </h1>

            <p className="mt-3 max-w-2xl text-slate-600">
              Automatically decide whether to email, call, send a final notice, or escalate an overdue invoice.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRun}
            disabled={running}
            className="w-full rounded-2xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60 sm:w-auto"
          >
            {running ? 'Running...' : 'Run Collections Engine'}
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ['Actions', metrics.total],
            ['Pending', metrics.pending],
            ['Call Tasks', metrics.calls],
            ['Escalations', metrics.escalations]
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="text-sm text-slate-500">{label}</div>
              <div className="mt-3 text-2xl font-semibold sm:text-3xl">{value}</div>
            </div>
          ))}
        </div>

        {result ? (
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-xl font-semibold">Last run summary</h2>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-6">
              <div>Evaluated: {result.evaluatedInvoices}</div>
              <div>Created: {result.actionsCreated}</div>
              <div>Emails: {result.emailsSent}</div>
              <div>Calls: {result.callTasksCreated}</div>
              <div>Skipped: {result.skipped}</div>
              <div>Failed: {result.failed}</div>
            </div>
          </section>
        ) : null}

        {error ? (
          <p className="mt-6 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>
        ) : null}

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-semibold">Collection Actions</h2>
              <p className="mt-1 text-sm text-slate-500">
                Emails are completed automatically. Call tasks and escalation reviews can be completed manually.
              </p>
            </div>

            <button
              type="button"
              onClick={loadActions}
              className="w-full rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium transition hover:bg-slate-50 sm:w-auto"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="mt-6 text-slate-600">Loading collection actions...</p>
          ) : (
            <div className="mt-6 w-full overflow-x-auto rounded-2xl">
              <table className="min-w-[1200px] w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="py-3">Action</th>
                    <th>Status</th>
                    <th>Invoice</th>
                    <th>Customer</th>
                    <th>Title</th>
                    <th>Reason</th>
                    <th>Scheduled</th>
                    <th>Complete</th>
                  </tr>
                </thead>

                <tbody>
                  {actions.map((action) => (
                    <tr key={action.id} className="border-b border-slate-100 align-top">
                      <td className="py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${actionClass(action.actionType)}`}>
                          {normalizeActionType(action.actionType)}
                        </span>
                      </td>

                      <td>
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass(action.status)}`}>
                          {normalizeStatus(action.status)}
                        </span>

                        {action.errorMessage ? (
                          <div className="mt-2 max-w-xs text-xs text-rose-600">
                            {action.errorMessage}
                          </div>
                        ) : null}
                      </td>

                      <td className="font-medium">{action.invoiceNumber}</td>
                      <td>
                        <div>{action.customerName}</div>
                        <div className="text-xs text-slate-500">{action.customerEmail}</div>
                      </td>
                      <td className="max-w-xs">{action.title}</td>
                      <td className="max-w-sm text-slate-600">{action.reason}</td>
                      <td>{formatDate(action.scheduledForUtc)}</td>

                      <td>
                        {normalizeStatus(action.status) === 'Pending' ? (
                          <div className="w-72">
                            <textarea
                              value={notesByAction[action.id] || ''}
                              onChange={(e) =>
                                setNotesByAction((current) => ({
                                  ...current,
                                  [action.id]: e.target.value
                                }))
                              }
                              placeholder="Completion notes"
                              className="min-h-[80px] w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm"
                            />

                            <button
                              type="button"
                              onClick={() => handleComplete(action.id)}
                              className="mt-2 w-full rounded-xl bg-slate-900 px-3 py-2 text-xs font-medium text-white"
                            >
                              Mark Complete
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-500">{formatDate(action.completedAtUtc)}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {actions.length === 0 ? (
                <p className="py-10 text-center text-slate-500">
                  No collection actions found. Run the collections engine to generate actions.
                </p>
              ) : null}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}