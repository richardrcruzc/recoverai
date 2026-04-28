import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { importLeadsCsv } from '../lib/leadImportApi';
import type { ImportLeadsResponse } from '../types/leadImport';

export default function LeadImport() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportLeadsResponse | null>(null);
  const [error, setError] = useState('');

  const handleImport = async () => {
    setError('');
    setResult(null);

    if (!file) {
      setError('Select a CSV file first.');
      return;
    }

    setImporting(true);

    try {
      const response = await importLeadsCsv(file);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not import leads.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              Lead Management
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Import Leads
            </h1>

            <p className="mt-3 max-w-2xl text-slate-600">
              Upload leads from Apollo.io or another CSV source. The importer checks duplicates by email.
            </p>
          </div>

          <Link
            to="/leads"
            className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-medium transition hover:bg-slate-50 sm:w-auto"
          >
            View Leads
          </Link>
        </div>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-xl font-semibold">CSV Upload</h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Supported columns: email, name, full name, company, organization, phone, title, source.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4">
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm"
            />

            {file ? (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                Selected file: <strong>{file.name}</strong>
              </div>
            ) : null}

            <button
              type="button"
              onClick={handleImport}
              disabled={importing}
              className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60 sm:w-auto"
            >
              {importing ? 'Importing...' : 'Import Leads'}
            </button>
          </div>

          {error ? (
            <p className="mt-6 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
              {error}
            </p>
          ) : null}
        </section>

        {result ? (
          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-xl font-semibold">Import Summary</h2>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
              <SummaryCard label="Rows" value={result.totalRows} />
              <SummaryCard label="Imported" value={result.imported} />
              <SummaryCard label="Skipped" value={result.skipped} />
              <SummaryCard label="Failed" value={result.failed} />
            </div>

            {result.errors.length > 0 ? (
              <div className="mt-6 rounded-2xl bg-rose-50 p-4">
                <h3 className="text-sm font-semibold text-rose-700">Errors</h3>

                <ul className="mt-3 space-y-2 text-sm text-rose-700">
                  {result.errors.slice(0, 20).map((item, index) => (
                    <li key={`${item}-${index}`}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        ) : null}
      </main>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}