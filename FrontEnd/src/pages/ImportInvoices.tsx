import { useState } from 'react';
import Header from '../components/Header';
import { importInvoicesCsv } from '../lib/importsApi';
import type { ImportInvoicesResponse } from '../types/imports';

const sampleCsv = `CustomerName,CompanyName,Email,Phone,InvoiceNumber,IssueDate,DueDate,Amount,Balance,Currency
Jane Smith,Acme Studio,jane@acme.com,555-111-2222,INV-1001,2026-04-01,2026-04-15,1500,1500,USD
John Perez,NorthPeak IT,john@northpeak.com,555-222-3333,INV-1002,2026-04-05,2026-04-20,3200,3200,USD`;

export default function ImportInvoices() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ImportInvoicesResponse | null>(null);
  const [error, setError] = useState('');
  const [importing, setImporting] = useState(false);

  const handleImport = async () => {
    setError('');
    setResult(null);
    setImporting(true);

    if (!file) {
      setError('Please select a CSV file.');
      setImporting(false);
      return;
    }

    try {
      const response = await importInvoicesCsv(file);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not import invoices.');
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'collectflowai-invoice-import-template.csv';
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            Onboarding
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Import Customers & Invoices
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Upload one CSV file to create customers and invoices together.
          </p>
        </div>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
            <div>
              <h2 className="text-xl font-semibold">Upload CSV</h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Required columns: CustomerName, CompanyName, Email, Phone, InvoiceNumber, IssueDate, DueDate, Amount, Balance, Currency.
              </p>

              <input
                type="file"
                accept=".csv,text/csv"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="mt-6 block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm"
              />

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleImport}
                  disabled={importing}
                  className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-medium text-white disabled:opacity-60"
                >
                  {importing ? 'Importing...' : 'Import CSV'}
                </button>

                <button
                  type="button"
                  onClick={downloadTemplate}
                  className="rounded-2xl border border-slate-300 px-6 py-3 text-sm font-medium"
                >
                  Download Template
                </button>
              </div>

              {error ? (
                <p className="mt-5 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
                  {error}
                </p>
              ) : null}
            </div>

            <div className="rounded-3xl bg-slate-50 p-5">
              <h3 className="font-semibold">CSV Example</h3>

              <pre className="mt-4 max-h-72 overflow-auto rounded-2xl bg-slate-900 p-4 text-xs text-white">
                {sampleCsv}
              </pre>
            </div>
          </div>
        </section>

        {result ? (
          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-xl font-semibold">Import Results</h2>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-4">
              <ResultCard label="Rows Read" value={result.rowsRead} />
              <ResultCard label="Customers Created" value={result.customersCreated} />
              <ResultCard label="Invoices Created" value={result.invoicesCreated} />
              <ResultCard label="Rows Skipped" value={result.rowsSkipped} />
            </div>

            {result.errors.length > 0 ? (
              <div className="mt-6 rounded-2xl bg-amber-50 p-4">
                <h3 className="font-medium text-amber-800">Import warnings</h3>

                <ul className="mt-3 space-y-2 text-sm text-amber-700">
                  {result.errors.map((item, index) => (
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

function ResultCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-3 text-3xl font-semibold">{value}</div>
    </div>
  );
}