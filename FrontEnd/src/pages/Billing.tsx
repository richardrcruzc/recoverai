import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { getBillingSummary } from '../lib/billingApi';
import type { BillingSummary } from '../types/billing';

function money(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD'
  }).format(value || 0);
}

export default function Billing() {
  const [summary, setSummary] = useState<BillingSummary | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getBillingSummary()
      .then(setSummary)
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load billing.'));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
          Billing
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Performance-Based Billing
        </h1>

        <p className="mt-3 max-w-2xl text-slate-600">
          RecoverAI tracks recovered payments and calculates the platform fee only on successful recoveries.
        </p>

        {error ? (
          <p className="mt-6 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        {!summary ? (
          <p className="mt-8 text-slate-600">Loading billing summary...</p>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Card label="Recovered Amount" value={money(summary.totalRecovered)} />
              <Card label="Total Fees" value={money(summary.totalFees)} />
              <Card label="Unbilled Fees" value={money(summary.unbilledFees)} />
              <Card label="Fee Rate" value={`${(summary.feeRate * 100).toFixed(1)}%`} />
            </div>

            <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <h2 className="text-xl font-semibold">Pricing Statement</h2>

              <p className="mt-3 leading-7 text-slate-600">
                RecoverAI uses performance-based pricing. Your business pays no upfront software fee.
                A small recovery fee is calculated only when payments are successfully recovered and recorded.
              </p>

              <div className="mt-6 rounded-2xl bg-slate-100 p-5 text-sm text-slate-700">
                Current recovery fee rate: <strong>{(summary.feeRate * 100).toFixed(1)}%</strong>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-3 text-2xl font-semibold sm:text-3xl">{value}</div>
    </div>
  );
}