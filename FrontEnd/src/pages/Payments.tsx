import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import { getInvoices } from '../lib/invoicesApi';
import { createPayment, getPayments } from '../lib/paymentsApi';
import type { Invoice } from '../types/invoice';
import type { CreatePaymentRequest, Payment } from '../types/payment';

const initialForm: CreatePaymentRequest = {
  invoiceId: '',
  amount: 0,
  currency: 'USD',
  paymentDate: new Date().toISOString().slice(0, 10),
  referenceNumber: '',
  notes: ''
};

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

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [form, setForm] = useState<CreatePaymentRequest>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const openInvoices = useMemo(() => {
    return invoices.filter((invoice) => Number(invoice.balance) > 0);
  }, [invoices]);

  const metrics = useMemo(() => {
    const totalCollected = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

    return {
      totalPayments: payments.length,
      totalCollected,
      openInvoices: openInvoices.length
    };
  }, [payments, openInvoices]);

  const selectedInvoice = useMemo(() => {
    return invoices.find((invoice) => invoice.id === form.invoiceId);
  }, [invoices, form.invoiceId]);

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const [paymentData, invoiceData] = await Promise.all([
        getPayments(),
        getInvoices()
      ]);

      setPayments(paymentData);
      setInvoices(invoiceData);

      const firstOpenInvoice = invoiceData.find((invoice) => Number(invoice.balance) > 0);

      if (!form.invoiceId && firstOpenInvoice) {
        setForm((current) => ({
          ...current,
          invoiceId: firstOpenInvoice.id,
          currency: firstOpenInvoice.currency || 'USD'
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load payment data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const updateForm = <K extends keyof CreatePaymentRequest>(
    key: K,
    value: CreatePaymentRequest[K]
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError('');
    setMessage('');
  };

  const handleInvoiceChange = (invoiceId: string) => {
    const invoice = invoices.find((x) => x.id === invoiceId);

    setForm((current) => ({
      ...current,
      invoiceId,
      currency: invoice?.currency || 'USD',
      amount: invoice ? Number(invoice.balance) : 0
    }));
  };

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    if (!form.invoiceId) {
      setError('Select an invoice.');
      setSaving(false);
      return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      setError('Payment amount must be greater than zero.');
      setSaving(false);
      return;
    }

    if (selectedInvoice && Number(form.amount) > Number(selectedInvoice.balance)) {
      setError('Payment amount cannot exceed invoice balance.');
      setSaving(false);
      return;
    }

    try {
      await createPayment({
        ...form,
        amount: Number(form.amount)
      });

      setForm({
        ...initialForm,
        invoiceId: form.invoiceId,
        currency: form.currency
      });

      setMessage('Payment recorded.');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not record payment.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Recovery Module</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">Payments</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Record payments against invoices and update invoice balances automatically.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            ['Payments', metrics.totalPayments],
            ['Collected', formatMoney(metrics.totalCollected)],
            ['Open Invoices', metrics.openInvoices]
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm text-slate-500">{label}</div>
              <div className="mt-3 text-3xl font-semibold">{value}</div>
            </div>
          ))}
        </div>

        <section className="mt-8 grid gap-8 xl:grid-cols-[430px_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Record Payment</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Select an open invoice and record the amount received.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleCreate}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Invoice</span>
                <select
                  value={form.invoiceId}
                  onChange={(e) => handleInvoiceChange(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  {openInvoices.length === 0 ? <option value="">No open invoices</option> : null}
                  {openInvoices.map((invoice) => (
                    <option key={invoice.id} value={invoice.id}>
                      {invoice.invoiceNumber} | {invoice.customerCompanyName || invoice.customerName} | Balance {formatMoney(Number(invoice.balance), invoice.currency)}
                    </option>
                  ))}
                </select>
              </label>

              {selectedInvoice ? (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                  <div className="font-medium text-slate-900">Selected Invoice</div>
                  <div className="mt-2">Invoice: {selectedInvoice.invoiceNumber}</div>
                  <div>Customer: {selectedInvoice.customerCompanyName || selectedInvoice.customerName}</div>
                  <div>Balance: {formatMoney(Number(selectedInvoice.balance), selectedInvoice.currency)}</div>
                </div>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Amount</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.amount}
                    onChange={(e) => updateForm('amount', Number(e.target.value))}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Currency</span>
                  <input
                    value={form.currency}
                    onChange={(e) => updateForm('currency', e.target.value)}
                    maxLength={3}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Payment date</span>
                <input
                  type="date"
                  value={form.paymentDate}
                  onChange={(e) => updateForm('paymentDate', e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Reference number</span>
                <input
                  value={form.referenceNumber}
                  onChange={(e) => updateForm('referenceNumber', e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="ACH-12345"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Notes</span>
                <textarea
                  value={form.notes}
                  onChange={(e) => updateForm('notes', e.target.value)}
                  className="min-h-[100px] w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Payment details or internal notes."
                />
              </label>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {saving ? 'Recording...' : 'Record Payment'}
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-xl font-semibold">Payment History</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Payments are loaded from your protected backend API.
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
              <p className="mt-6 text-slate-600">Loading payments...</p>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="py-3">Date</th>
                      <th>Invoice</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Reference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id} className="border-b border-slate-100">
                        <td className="py-4">{formatDate(payment.paymentDate)}</td>
                        <td className="font-medium">{payment.invoiceNumber}</td>
                        <td>{payment.customerCompanyName || payment.customerName}</td>
                        <td>{formatMoney(Number(payment.amount), payment.currency)}</td>
                        <td>{payment.referenceNumber || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {payments.length === 0 ? (
                  <p className="py-10 text-center text-slate-500">No payments found.</p>
                ) : null}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}