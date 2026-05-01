import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import { getCustomers } from '../lib/customersApi';
import { createInvoice, getInvoices, updateInvoiceStatus } from '../lib/invoicesApi';
import type { Customer } from '../types/customer';
import type { CreateInvoiceRequest, Invoice } from '../types/invoice';
import UpgradeModal from '../components/UpgradeModal';
import { isPaywallError } from '../lib/paywall';

const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';

const invoiceStatuses = [
  { key: 1, label: 'Draft' },
  { key: 2, label: 'Sent' },
  { key: 3, label: 'Partially Paid' },
  { key: 4, label: 'Paid' },
  { key: 5, label: 'Overdue' },
  { key: 6, label: 'Written Off' }
];

const initialForm: CreateInvoiceRequest = {
  tenantId: DEFAULT_TENANT_ID,
  customerId: '',
  invoiceNumber: '',
  issueDate: new Date().toISOString().slice(0, 10),
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  amount: 0,
  balance: 0,
  currency: 'USD'
};

function normalizeStatus(status: string | number): string {
  if (typeof status === 'string') return status;

  const map: Record<number, string> = {
    1: 'Draft',
    2: 'Sent',
    3: 'PartiallyPaid',
    4: 'Paid',
    5: 'Overdue',
    6: 'WrittenOff'
  };

  return map[status] ?? '2';
}

function formatMoney(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency
  }).format(amount || 0);
}

function formatDate(value?: string): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium'
  }).format(date);
}

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState<CreateInvoiceRequest>(initialForm);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [upgradeOpen, setUpgradeOpen] = useState(false);
const [upgradeMessage, setUpgradeMessage] = useState('');

  const metrics = useMemo(() => {
    const totalBalance = invoices.reduce((sum, invoice) => sum + Number(invoice.balance || 0), 0);
    const overdueBalance = invoices
      .filter((invoice) => normalizeStatus(invoice.status) === 'Overdue')
      .reduce((sum, invoice) => sum + Number(invoice.balance || 0), 0);
    const paid = invoices.filter((invoice) => normalizeStatus(invoice.status) === 'Paid').length;

    return {
      total: invoices.length,
      totalBalance,
      overdueBalance,
      paid
    };
  }, [invoices]);

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const [invoiceData, customerData] = await Promise.all([
        getInvoices(statusFilter),
        getCustomers()
      ]);

      setInvoices(invoiceData);
      setCustomers(customerData);

      if (!form.customerId && customerData.length > 0) {
        setForm((current) => ({
          ...current,
          customerId: customerData[0].id,
          tenantId: customerData[0].tenantId || DEFAULT_TENANT_ID
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load invoice data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const updateForm = <K extends keyof CreateInvoiceRequest>(
    key: K,
    value: CreateInvoiceRequest[K]
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError('');
    setMessage('');
  };

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find((x) => x.id === customerId);

    setForm((current) => ({
      ...current,
      customerId,
      tenantId: customer?.tenantId || DEFAULT_TENANT_ID
    }));
  };

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    if (!form.customerId) {
      setError('Select a customer first.');
      setSaving(false);
      return;
    }

    if (!form.invoiceNumber.trim()) {
      setError('Invoice number is required.');
      setSaving(false);
      return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      setError('Amount must be greater than zero.');
      setSaving(false);
      return;
    }

    try {
      await createInvoice({
        ...form,
        amount: Number(form.amount),
        balance: Number(form.balance || form.amount)
      });

      setForm({
        ...initialForm,
        customerId: form.customerId,
        tenantId: form.tenantId
      });

      setMessage('Invoice created.');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create invoice.');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (invoice: Invoice, status: string) => {
    setError('');
    setMessage('');
console.log(`Updating invoice ${invoice.id} status to ${status}`);
    try {
      await updateInvoiceStatus(invoice.id, status);
      setMessage('Invoice status updated.');
      await loadData();
    } catch (err) {
      if (isPaywallError(err)) {
    setUpgradeMessage(err instanceof Error ? err.message : 'Upgrade required.');
    setUpgradeOpen(true);
  } else {
    setError(err instanceof Error ? err.message : 'Operation failed.');
  }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Core Revenue Module</p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">Invoices</h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Track open invoices, overdue balances, customer exposure, and payment status.
            </p>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value.toString())}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm"
          >
            {invoiceStatuses.map((status) => (
              <option key={status.key} value={status.key}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {[
            ['Invoices', metrics.total],
            ['Open Balance', formatMoney(metrics.totalBalance)],
            ['Overdue Balance', formatMoney(metrics.overdueBalance)],
            ['Paid Count', metrics.paid]
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm text-slate-500">{label}</div>
              <div className="mt-3 text-3xl font-semibold">{value}</div>
            </div>
          ))}
        </div>

        <section className="mt-8 grid gap-8 xl:grid-cols-[430px_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Create Invoice</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Attach invoices to customers so the collections workflow can prioritize follow-ups.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleCreate}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Customer</span>
                <select
                  value={form.customerId}
                  onChange={(e) => handleCustomerChange(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  {customers.length === 0 ? <option value="">No customers available</option> : null}
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.companyName || customer.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Tenant Id</span>
                <input
                  value={form.tenantId}
                  onChange={(e) => updateForm('tenantId', e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Invoice number</span>
                <input
                  value={form.invoiceNumber}
                  onChange={(e) => updateForm('invoiceNumber', e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="INV-1001"
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Issue date</span>
                  <input
                    type="date"
                    value={form.issueDate}
                    onChange={(e) => updateForm('issueDate', e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Due date</span>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => updateForm('dueDate', e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Amount</span>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={(e) => updateForm('amount', Number(e.target.value))}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    min="0"
                    step="0.01"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Balance</span>
                  <input
                    type="number"
                    value={form.balance}
                    onChange={(e) => updateForm('balance', Number(e.target.value))}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    min="0"
                    step="0.01"
                    placeholder="Defaults to amount"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Currency</span>
                  <input
                    value={form.currency}
                    onChange={(e) => updateForm('currency', e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    maxLength={3}
                  />
                </label>

               
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {saving ? 'Creating...' : 'Create Invoice'}
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-xl font-semibold">Invoice List</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Invoices are loaded from your protected backend API.
                </p>
              </div>

              <button
                type="button"
                onClick={loadData}
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
             <div className="mt-10 flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"></div>
            </div>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="py-3">Invoice</th>
                      <th>Customer</th>
                      <th>Due</th>
                      <th>Amount</th>
                      <th>Balance</th>
                      <th>Status</th>
                      <th>Days Overdue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b border-slate-100">
                        <td className="py-4 font-medium">{invoice.invoiceNumber}</td>
                        <td>{invoice.customerCompanyName || invoice.customerName}</td>
                        <td>{formatDate(invoice.dueDate)}</td>
                        <td>{formatMoney(Number(invoice.amount), invoice.currency)}</td>
                        <td>{formatMoney(Number(invoice.balance), invoice.currency)}</td>
                        <td>status: {invoice.status}</td>
                        <td>
                          <select
                            value={invoice.status}
                            onChange={(e) => handleStatusChange(invoice, e.target.value)}
                            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                          >
                            {invoiceStatuses.filter((x) => x.label !== 'All').map((status) => (
                              <option key={status.key} value={status.key}>
                                {status.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          {invoice.daysOverdue > 0 ? (
                            <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
                              {invoice.daysOverdue}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {invoices.length === 0 ? (
                  <p className="py-10 text-center text-slate-500">No invoices found.</p>
                ) : null}
              </div>
            )}
          </div>
        </section>
        <UpgradeModal
  open={upgradeOpen}
  message={upgradeMessage}
  onClose={() => setUpgradeOpen(false)}
/>
      </main>
    </div>
  );
}
