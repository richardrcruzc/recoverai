import Header from '../components/Header';
import LeadForm from '../components/LeadForm';

const pricing = [
  { name: 'Starter', price: '$49/mo', features: ['Up to 250 invoices', 'Email reminders', 'Basic dashboard'] },
  { name: 'Growth', price: '$99/mo', features: ['Up to 1,000 invoices', 'Email + SMS flows', 'Priority scoring'], featured: true },
  { name: 'Pro', price: '$199/mo', features: ['Unlimited workflows', 'Advanced reporting', 'Team access'] },
  { name: 'Performance', price: '1%–3% recovered', features: ['Lower fixed cost', 'Aligned to collected cash', 'Best for higher-volume receivables'] }
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main>
        <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center">
          <div>
            <div className="mb-4 inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">Built for agencies, consultants, and B2B service firms</div>
            <h1 className="max-w-2xl text-3xl sm:text-4xl font-semibold tracking-tight md:text-6xl">Stop chasing unpaid invoices. Get paid automatically.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">RecoverAI helps service businesses collect overdue invoices with automated follow-ups, smart prioritization, and payment-ready workflows.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#cta" className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:opacity-90">Book a Demo</a>
              <a href="#pricing" className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-100">View Pricing</a>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div><div className="text-sm font-medium text-slate-500">Collections Dashboard</div><div className="text-2xl font-semibold">$84,250 overdue</div></div>
              <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">+18% recovered</div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-100 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Priority queue</div>
                <div className="mt-3 space-y-3">
                  {[
                    ['Acme Studio', '$6,800', 'High likelihood'],
                    ['NorthPeak IT', '$3,200', 'Needs escalation'],
                    ['Blue Harbor', '$1,450', 'Friendly reminder']
                  ].map(([name, amount, note]) => (
                    <div key={name} className="rounded-xl bg-white p-3 shadow-sm">
                      <div className="flex items-center justify-between text-sm font-medium"><span>{name}</span><span>{amount}</span></div>
                      <div className="mt-1 text-xs text-slate-500">{note}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-100 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Workflow</div>
                <div className="mt-3 space-y-3">{['Day 3: Friendly email reminder','Day 7: SMS follow-up','Day 15: Firm payment request','Day 30: Final notice + call task'].map((item) => <div key={item} className="rounded-xl bg-white p-3 text-sm shadow-sm">{item}</div>)}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-6 px-6 py-14 md:grid-cols-3">
            {[
              ['Recover cash faster','Automated reminders and escalation flows help turn overdue invoices into collected revenue.'],
              ['Reduce manual follow-up','No more wasting hours on emails, texts, and awkward payment chases.'],
              ['Know who to contact first','Prioritize the accounts most likely to pay based on aging, balance, and behavior.']
            ].map(([title, body]) => <div key={title} className="rounded-3xl border border-slate-200 p-6 shadow-sm"><h3 className="text-xl font-semibold">{title}</h3><p className="mt-3 leading-7 text-slate-600">{body}</p></div>)}
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-2xl">
            <div className="text-sm font-medium uppercase tracking-wide text-slate-500">Pricing</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-3xl sm:text-4xl">Simple pricing that pays for itself with one recovered invoice.</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {pricing.map((plan) => (
              <div key={plan.name} className={`rounded-3xl border p-6 shadow-sm ${plan.featured ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-900'}`}>
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <div className="mt-4 text-3xl font-semibold">{plan.price}</div>
                <ul className="mt-6 space-y-3 text-sm">{plan.features.map((feature) => <li key={feature}>• {feature}</li>)}</ul>
                <a href="#cta" className={`mt-8 inline-block rounded-2xl px-5 py-3 text-sm font-medium transition ${plan.featured ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-slate-900 text-white hover:opacity-90'}`}>Start with {plan.name}</a>
              </div>
            ))}
          </div>
        </section>

        <section id="cta" className="mx-auto max-w-5xl px-6 py-20">
          <div className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-2xl md:p-12">
            <div className="max-w-3xl">
              <div className="text-sm font-medium uppercase tracking-wide text-slate-400">Early access</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-3xl sm:text-4xl">Stop leaving money on the table.</h2>
              <p className="mt-4 text-lg leading-8 text-slate-300">Book a demo and we’ll show you how to turn overdue invoices into a repeatable cash collection workflow.</p>
            </div>
            <LeadForm />
          </div>
        </section>
      </main>
    </div>
  );
}
