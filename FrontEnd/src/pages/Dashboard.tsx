import Header from '../components/Header';

const metrics = [
  ['Overdue Balance', '$84,250'],
  ['Recovered This Month', '$18,430'],
  ['Open Invoices', '46'],
  ['Priority Accounts', '12']
];

const invoices = [
  ['INV-1001', 'Acme Studio', '$6,800', '32 days overdue', 'High'],
  ['INV-1002', 'NorthPeak IT', '$3,200', '18 days overdue', 'Medium'],
  ['INV-1003', 'Blue Harbor', '$1,450', '7 days overdue', 'Low']
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">RecoverAI Dashboard</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">Collections overview</h1>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {metrics.map(([label, value]) => (
            <div key={label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm text-slate-500">{label}</div>
              <div className="mt-3 text-3xl font-semibold">{value}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Priority collections queue</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-3">Invoice</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(([invoice, customer, amount, status, priority]) => (
                  <tr key={invoice} className="border-b border-slate-100">
                    <td className="py-4 font-medium">{invoice}</td>
                    <td>{customer}</td>
                    <td>{amount}</td>
                    <td>{status}</td>
                    <td>{priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
