import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="flex items-center justify-between px-6 py-5 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/logo.png" className="h-10" />
          <span className="text-xl font-semibold">RecoverAI</span>
        </div>

        <div className="flex gap-4">
          <Link to="/pricing" className="text-sm">Pricing</Link>
          <Link to="/login" className="text-sm font-medium">Login</Link>
        </div>
      </header>

      <main className="text-center py-20 px-6">
        <h1 className="text-5xl font-bold">
          AI Collections for Service Businesses
        </h1>

        <p className="mt-6 text-lg text-slate-600">
          Recover unpaid invoices automatically using AI-driven reminders and prioritization.
        </p>

        <Link
          to="/pricing"
          className="inline-block mt-10 bg-slate-900 text-white px-8 py-4 rounded-2xl"
        >
          View Pricing
        </Link>
      </main>
    </div>
  );
}