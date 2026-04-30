import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { getSalesFunnel, getSalesFunnelDailyTrend } from '../lib/reportsApi';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts'; 
import type { SalesFunnelDailyTrend } from '../types/sales';


export default function SalesDashboard() {
  const [data, setData] = useState<any>(null);
const [trend, setTrend] = useState<SalesFunnelDailyTrend[]>([]);

  useEffect(() => {
  Promise.all([
    getSalesFunnel(),
    getSalesFunnelDailyTrend()
  ]).then(([summary, dailyTrend]) => {
    setData(summary);
    setTrend(dailyTrend);
  });
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
         <div className="mt-8 grid grid-cols-2 gap-4">
            <Card label="Emails Sent" value={data.emailsSent} />
            <Card label="Reply Rate" value={(data.replyRate * 100).toFixed(1) + '%'} />
         </div>
      </div>
      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
  <h2 className="text-xl font-semibold">Last 7 Days Trend</h2>
  <p className="mt-1 text-sm text-slate-500">
    Tracks outbound emails, replies, demos, activations, and paying customers.
  </p>

  <div className="mt-6 h-80 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={trend}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Line type="monotone" dataKey="emailsSent" name="Emails Sent" strokeWidth={2} />
        <Line type="monotone" dataKey="replies" name="Replies" strokeWidth={2} />
        <Line type="monotone" dataKey="demosScheduled" name="Demos" strokeWidth={2} />
        <Line type="monotone" dataKey="activated" name="Activated" strokeWidth={2} />
        <Line type="monotone" dataKey="payingCustomers" name="Paying" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>
</section>
<section className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
  <h2 className="text-xl font-semibold">Daily Breakdown</h2>

  <div className="mt-6 w-full overflow-x-auto rounded-2xl">
    <table className="min-w-[800px] w-full text-left text-sm">
      <thead className="border-b border-slate-200 text-slate-500">
        <tr>
          <th className="py-3">Date</th>
          <th>Emails</th>
          <th>Replies</th>
          <th>Reply Rate</th>
          <th>Demos</th>
          <th>Activated</th>
          <th>Paying</th>
        </tr>
      </thead>
      <tbody>
        {trend.map((row) => (
          <tr key={row.date} className="border-b border-slate-100">
            <td className="py-4 font-medium">{row.date}</td>
            <td>{row.emailsSent}</td>
            <td>{row.replies}</td>
            <td>{(row.replyRate * 100).toFixed(1)}%</td>
            <td>{row.demosScheduled}</td>
            <td>{row.activated}</td>
            <td>{row.payingCustomers}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>
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