import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import Header from '../components/Header';

export default function ThankYou() {
  const calendlyUrl = import.meta.env.VITE_CALENDLY_URL || '#';
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-5xl items-center px-6 py-16">
        <section className="w-full rounded-[2rem] border border-slate-200 bg-white p-10 shadow-xl md:p-14">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><CheckCircle2 className="h-8 w-8" /></div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-600">Request received</p>
            <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight md:text-5xl">Thanks, you’re in.</h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">We captured your request and will follow up to schedule a demo.</p>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href={calendlyUrl} className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:opacity-90">Schedule Demo</a>
            <Link to="/leads" className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-100">View Leads</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
