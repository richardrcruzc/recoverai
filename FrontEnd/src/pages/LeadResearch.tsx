import { useState } from 'react';
import Header from '../components/Header';
import { runLeadScraping } from '../lib/leadScrapingApi';
import type { RunLeadScrapeResponse } from '../types/leadScraping';

export default function LeadResearch() {
  const [sourceName, setSourceName] = useState('ManualWebSearch');
  const [location, setLocation] = useState('Florida');
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunLeadScrapeResponse | null>(null);
  const [error, setError] = useState('');

  const handleRun = async () => {
    setRunning(true);
    setError('');
    setResult(null);

    if (!searchQuery.trim()) {
      setError('Paste at least one public company website URL.');
      setRunning(false);
      return;
    }

    try {
      const response = await runLeadScraping({
        sourceName,
        location,
        limit,
        searchQuery
      });

      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not run lead research.');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            Growth System
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Lead Research
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Paste public company website URLs, extract visible business emails, score prospects, and create outbound contacts.
          </p>
        </div>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Source name
              </span>
              <input
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Location
              </span>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Limit
              </span>
              <input
                type="number"
                min={1}
                max={50}
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </label>
          </div>

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Public company website URLs
            </span>

            <textarea
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`https://exampleagency.com
https://sampleitservices.com
https://bookkeepingfirm.com`}
              className="min-h-[220px] w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </label>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleRun}
              disabled={running}
              className="w-full rounded-2xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60 sm:w-auto"
            >
              {running ? 'Researching...' : 'Run Lead Research'}
            </button>

            <p className="text-sm text-slate-500">
              Use public websites only. Avoid private or login-protected sources.
            </p>
          </div>

          {error ? (
            <p className="mt-5 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
              {error}
            </p>
          ) : null}

          {result ? (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <ResultCard label="Companies Found" value={result.companiesFound} />
              <ResultCard label="Contacts Created" value={result.contactsCreated} />
              <ResultCard label="Contacts Skipped" value={result.contactsSkipped} />
            </div>
          ) : null}
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-xl font-semibold">Next step after research</h2>

          <p className="mt-3 leading-7 text-slate-600">
            Go to the Outbound page, review newly created contacts, verify their emails, then send a small campaign batch.
          </p>
        </section>
      </main>
    </div>
  );
}

function ResultCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-3 text-3xl font-semibold">{value}</div>
    </div>
  );
}