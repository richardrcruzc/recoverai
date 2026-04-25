import { Link } from 'react-router-dom';
import Header from '../components/Header';

export default function Dashboard() {
  const modules = [
    ['Leads', 'Review demo requests and move prospects through the pipeline.', '/leads'],
    ['Customers', 'Coming next: manage customer records and contacts.', '#'],
    ['Invoices', 'Coming next: track unpaid invoices and aging buckets.', '#'],
    ['Workflows', 'Coming next: automate reminders and escalation logic.', '#']
  ];
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">RecoverAI Dashboard</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">SaaS control center</h1>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {modules.map(([title, body, href]) => <Link key={title} to={href} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><h2 className="text-xl font-semibold">{title}</h2><p className="mt-3 leading-7 text-slate-600">{body}</p></Link>)}
        </div>
      </main>
    </div>
  );
}
