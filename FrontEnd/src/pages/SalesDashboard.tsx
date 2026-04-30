import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { getSalesFunnel } from '../lib/reportsApi';

export default function SalesDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getSalesFunnel().then(setData);
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-semibold mb-6">Sales Funnel</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card label="Leads" value={data.leads} />
          <Card label="Replied" value={data.replied} />
          <Card label="Demo" value={data.demoScheduled} />
          <Card label="Activated" value={data.activated} />
          <Card label="Paying" value={data.payingCustomers} />
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card label="Reply Rate" value={(data.replyRate * 100).toFixed(1) + '%'} />
          <Card label="Demo Rate" value={(data.demoRate * 100).toFixed(1) + '%'} />
          <Card label="Activation Rate" value={(data.activationRate * 100).toFixed(1) + '%'} />
          <Card label="Conversion Rate" value={(data.conversionRate * 100).toFixed(1) + '%'} />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <Card label="Recovered $" value={data.totalRecovered} />
          <Card label="Fees $" value={data.totalFees} />
        </div>
      </div>
    </div>
  );
}

function Card({ label, value }: any) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="text-xl font-semibold mt-2">{value}</div>
    </div>
  );
}