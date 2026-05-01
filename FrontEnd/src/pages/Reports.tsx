import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { getRecoverySummary } from '../lib/reportsApi';
import type { RecoverySummary } from '../types/report';

function money(v: number) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD'
  }).format(v || 0);
}

export default function Reports() {
  const [data, setData] = useState<RecoverySummary | null>(null);

  useEffect(() => {
    getRecoverySummary().then(setData);
  }, []);

  if (!data) return <div className="mt-10 flex items-center justify-center">
  <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"></div>
</div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <h1 className="text-3xl sm:text-4xl font-semibold">Recovery Dashboard</h1>

        <div className="grid gap-5 mt-8 md:grid-cols-4">
          <Card label="Collected" value={money(data.totalCollected)} />
          <Card label="Outstanding" value={money(data.totalOutstanding)} />
          <Card label="Overdue" value={money(data.overdueBalance)} />
          <Card label="Collection Rate" value={`${data.collectionRate}%`} />
        </div>

        <div className="grid gap-5 mt-8 md:grid-cols-3">
          <Card label="Total Invoices" value={data.totalInvoices} />
          <Card label="Paid Invoices" value={data.paidInvoices} />
          <Card label="Overdue Invoices" value={data.overdueInvoices} />
        </div>
      </main>
    </div>
  );
}

function Card({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="text-3xl font-semibold mt-2">{value}</div>
    </div>
  );
}