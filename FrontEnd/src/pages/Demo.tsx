import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { demoInvoices, demoMetrics, demoReminders } from '../lib/demoData';
import Footer from '../components/Footer';

function money(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD'
  }).format(value || 0);
}

function priorityClass(priority: string) {
  if (priority === 'Critical') return 'bg-rose-50 text-rose-700';
  if (priority === 'High') return 'bg-orange-50 text-orange-700';
  if (priority === 'Medium') return 'bg-amber-50 text-amber-700';
  return 'bg-emerald-50 text-emerald-700';
}

export default function Demo() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              Public Demo
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">
              CollectFlowAI Demo Dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Explore how CollectFlowAI prioritizes overdue invoices, automates reminders, and tracks collections without logging in.
            </p>
          </div>

          <Link
            to="/onboarding"
            className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Start Setup
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-5">
          <Card label="Overdue Balance" value={money(demoMetrics.overdueBalance)} />
          <Card label="Collected This Month" value={money(demoMetrics.collectedThisMonth)} />
          <Card label="Open Invoices" value={demoMetrics.openInvoices} />
          <Card label="Priority Accounts" value={demoMetrics.priorityAccounts} />
          <Card label="Collection Rate" value={`${demoMetrics.collectionRate}%`} />
        </div>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">AI Priority Queue</h2>
          <p className="mt-1 text-sm text-slate-500">
            Fake demo data showing how collection risk is prioritized.
          </p>

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
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {demoInvoices.map((invoice) => (
                  <tr key={invoice.invoiceNumber} className="border-b border-slate-100">
                    <td className="py-4 text-xl font-semibold">{invoice.score}</td>
                    <td>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${priorityClass(invoice.priority)}`}>
                        {invoice.priority}
                      </span>
                    </td>
                    <td className="font-medium">{invoice.invoiceNumber}</td>
                    <td>{invoice.customer}</td>
                    <td>{money(invoice.balance)}</td>
                    <td>{invoice.daysOverdue}</td>
                    <td>{invoice.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Reminder Activity</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {demoReminders.map((item) => (
              <div key={item.invoice} className="rounded-3xl border border-slate-200 p-5">
                <div className="text-sm font-medium text-slate-500">{item.invoice}</div>
                <div className="mt-2 text-lg font-semibold">{item.customer}</div>
                <div className="mt-3 text-sm text-slate-600">{item.subject}</div>
                <div className="mt-4 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium inline-block">
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-10 rounded-3xl bg-slate-900 p-8 text-white">
          <h2 className="text-2xl font-semibold">Ready to create your workspace?</h2>
          <p className="mt-3 text-slate-300">
            Set up your tenant, create your admin account, then start adding customers and invoices.
          </p>

          <Link
            to="/onboarding"
            className="mt-6 inline-block rounded-2xl bg-white px-6 py-3 text-sm font-medium text-slate-900"
          >
            Start Tenant Onboarding
          </Link>
        </div>
      </main>
       <div className="min-h-screen bg-slate-50 text-slate-900">  
            <Footer />
          </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-3 text-2xl font-semibold">{value}</div>
    </div>
  );
}