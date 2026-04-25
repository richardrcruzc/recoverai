import { Link } from 'react-router-dom';

export default function Pricing() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="flex items-center justify-between px-6 py-5 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/logo.png" className="h-10" />
          <span className="text-xl font-semibold">RecoverAI</span>
        </div>

        <Link to="/login" className="text-sm font-medium">Login</Link>
      </header>

      <main className="max-w-5xl mx-auto py-16 px-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold">Pricing</h1>

        <div className="grid md:grid-cols-2 gap-8 mt-12">

          <div className="bg-white p-8 rounded-3xl shadow">
            <h2 className="text-2xl font-semibold">Starter</h2>
            <p className="text-3xl sm:text-4xl mt-4 font-bold">$49/mo</p>

            <ul className="mt-6 text-left space-y-2 text-slate-600">
              <li>Invoices & reminders</li>
              <li>Basic reporting</li>
              <li>Manual scoring</li>
            </ul>

            <Link
              to="/login"
              className="block mt-8 bg-slate-900 text-white py-3 rounded-xl"
            >
              Get Started
            </Link>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow border-2 border-slate-900">
            <h2 className="text-2xl font-semibold">Pro</h2>
            <p className="text-3xl sm:text-4xl mt-4 font-bold">$99/mo + %</p>

            <ul className="mt-6 text-left space-y-2 text-slate-600">
              <li>AI scoring engine</li>
              <li>Automated reminders</li>
              <li>Recovery analytics</li>
              <li>Priority queue</li>
            </ul>

            <Link
              to="/login"
              className="block mt-8 bg-slate-900 text-white py-3 rounded-xl"
            >
              Start Free Trial
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}