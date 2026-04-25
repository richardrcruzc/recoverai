import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import { createCustomer, getCustomers } from '../lib/customersApi';
import type { CreateCustomerRequest, Customer } from '../types/customer';

const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';

const initialForm: CreateCustomerRequest = {
  tenantId: DEFAULT_TENANT_ID,
  name: '',
  companyName: '',
  email: '',
  phone: '',
  notes: ''
};

function formatDate(value?: string): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState<CreateCustomerRequest>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const metrics = useMemo(() => {
    return {
      total: customers.length,
      withEmail: customers.filter((x) => Boolean(x.email)).length,
      companies: new Set(customers.map((x) => x.companyName).filter(Boolean)).size
    };
  }, [customers]);

  const loadCustomers = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load customers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCustomers();
  }, []);

  const updateForm = <K extends keyof CreateCustomerRequest>(
    key: K,
    value: CreateCustomerRequest[K]
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError('');
    setMessage('');
  };

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    if (!form.name.trim()) {
      setError('Customer name is required.');
      setSaving(false);
      return;
    }

    try {
      await createCustomer(form);
      setForm(initialForm);
      setMessage('Customer created.');
      await loadCustomers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create customer.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Product Module</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">Customers</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Manage customer records before connecting invoices, aging buckets, and reminder workflows.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            ['Customers', metrics.total],
            ['With Email', metrics.withEmail],
            ['Companies', metrics.companies]
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm text-slate-500">{label}</div>
              <div className="mt-3 text-3xl font-semibold">{value}</div>
            </div>
          ))}
        </div>

        <section className="mt-8 grid gap-8 lg:grid-cols-[420px_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Create Customer</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Add a customer that can later be attached to unpaid invoices.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleCreate}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Tenant Id</span>
                <input
                  value={form.tenantId}
                  onChange={(e) => updateForm('tenantId', e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Customer name</span>
                <input
                  value={form.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Jane Smith"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Company name</span>
                <input
                  value={form.companyName}
                  onChange={(e) => updateForm('companyName', e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Acme Studio"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateForm('email', e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="customer@company.com"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Phone</span>
                <input
                  value={form.phone}
                  onChange={(e) => updateForm('phone', e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="555-111-2222"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Notes</span>
                <textarea
                  value={form.notes}
                  onChange={(e) => updateForm('notes', e.target.value)}
                  className="min-h-[100px] w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Payment history, preferences, or internal notes."
                />
              </label>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {saving ? 'Creating...' : 'Create Customer'}
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-xl font-semibold">Customer List</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Customers are loaded from your protected backend API.
                </p>
              </div>

              <button
                type="button"
                onClick={loadCustomers}
                className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium transition hover:bg-slate-50"
              >
                Refresh
              </button>
            </div>

            {message ? (
              <p className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">{message}</p>
            ) : null}

            {error ? (
              <p className="mt-5 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>
            ) : null}

            {loading ? (
              <p className="mt-6 text-slate-600">Loading customers...</p>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="py-3">Name</th>
                      <th>Company</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer.id} className="border-b border-slate-100">
                        <td className="py-4 font-medium">{customer.name}</td>
                        <td>{customer.companyName || '—'}</td>
                        <td>{customer.email || '—'}</td>
                        <td>{customer.phone || '—'}</td>
                        <td>{formatDate(customer.createdAtUtc)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {customers.length === 0 ? (
                  <p className="py-10 text-center text-slate-500">No customers found.</p>
                ) : null}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
