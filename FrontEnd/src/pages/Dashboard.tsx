import { Link } from 'react-router-dom';
import Header from '../components/Header';

export default function Dashboard() {
  const adminModules = [
    ['Admin User', 'Manage internal users, roles, and future authentication access.', '/admin/users'],
    ['Leads Admin', 'Review demo requests and move prospects through the pipeline.', '/leads']
  ];

  const productModules = [
    ['Customers', 'Manage customer records and contacts.', '/customers'],
    ['Invoices', 'Track unpaid invoices, balances, and aging status.', '/invoices'],
    ['Workflows', 'Coming next: automate reminders and escalation logic.', '#']
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">RecoverAI Dashboard</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">SaaS control center</h1>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">Administration</h2>
          <p className="mt-2 text-slate-600">
            Start here to manage internal access and lead operations.
          </p>

          <div className="mt-5 grid gap-6 md:grid-cols-2">
            {adminModules.map(([title, body, href]) => (
              <Link
                key={title}
                to={href}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{body}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">Product Modules</h2>
          <p className="mt-2 text-slate-600">
            These modules will become the operating system for collections automation.
          </p>

          <div className="mt-5 grid gap-6 md:grid-cols-3">
            {productModules.map(([title, body, href]) => (
              <Link
                key={title}
                to={href}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{body}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
