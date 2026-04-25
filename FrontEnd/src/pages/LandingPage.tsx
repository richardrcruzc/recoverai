import LeadForm from '@/components/LeadForm';

const benefits = [
  {
    title: 'Recover cash faster',
    body: 'Automated reminders and escalation flows help turn overdue invoices into collected revenue.',
  },
  {
    title: 'Reduce manual follow-up',
    body: 'No more wasting hours on emails, texts, and awkward payment chases.',
  },
  {
    title: 'Know who to contact first',
    body: 'Prioritize the accounts most likely to pay based on aging, balance, and behavior.',
  },
];

const howItWorks = [
  { step: '1', title: 'Import invoices', body: 'Upload unpaid invoices or connect your workflow so your receivables are centralized in one place.' },
  { step: '2', title: 'Automate follow-ups', body: 'Set reminder sequences by aging bucket with email, SMS, and escalation logic.' },
  { step: '3', title: 'Collect faster', body: 'Customers receive clear reminders and payment links so they can pay quickly.' },
];

const proof = [
  'Reduce hours spent chasing payments',
  'Improve visibility into overdue accounts',
  'Create a repeatable collections process',
];

const pricing = [
  { name: 'Starter', price: '$49/mo', features: ['Up to 250 invoices', 'Email reminders', 'Basic dashboard'], featured: false },
  { name: 'Growth', price: '$99/mo', features: ['Up to 1,000 invoices', 'Email + SMS flows', 'Priority scoring'], featured: true },
  { name: 'Pro', price: '$199/mo', features: ['Unlimited workflows', 'Advanced reporting', 'Team access'], featured: false },
  { name: 'Performance', price: '1%–3% of recovered invoices', features: ['Lower fixed cost', 'Aligned to collected cash', 'Best for higher-volume receivables'], featured: false },
];

const faq = [
  { q: 'Does this replace QuickBooks?', a: 'No. QuickBooks tracks invoices. RecoverAI helps you collect them faster.' },
  { q: 'Who is this for?', a: 'Best for agencies, consultants, IT service firms, and other B2B businesses with recurring invoicing.' },
  { q: 'How long does setup take?', a: 'Early users can be onboarded in less than a day with a simple import and workflow setup.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <div className="text-xl font-semibold tracking-tight">RecoverAI</div>
            <div className="text-xs text-slate-500">AI collections for service businesses</div>
          </div>
          <div className="hidden gap-6 text-sm md:flex">
            <a href="#how" className="hover:text-slate-600">How it works</a>
            <a href="#pricing" className="hover:text-slate-600">Pricing</a>
            <a href="#faq" className="hover:text-slate-600">FAQ</a>
          </div>
          <a href="#cta" className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90">Book a Demo</a>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center">
          <div>
            <div className="mb-4 inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">
              Built for agencies, consultants, and B2B service firms
            </div>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight md:text-6xl">Stop Chasing Unpaid Invoices. Get Paid Automatically.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              RecoverAI helps service businesses collect overdue invoices with automated follow-ups, smart prioritization, and payment-ready workflows.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#cta" className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:opacity-90">Book a Demo</a>
              <a href="#cta" className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-100">Get Early Access</a>
            </div>
            <div className="mt-8 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
              {proof.map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">{item}</div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-500">Collections Dashboard</div>
                <div className="text-2xl font-semibold">$84,250 overdue</div>
              </div>
              <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">+18% recovered</div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-100 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Priority queue</div>
                <div className="mt-3 space-y-3">
                  {[
                    ['Acme Studio', '$6,800', 'High likelihood'],
                    ['NorthPeak IT', '$3,200', 'Needs escalation'],
                    ['Blue Harbor', '$1,450', 'Friendly reminder'],
                  ].map(([name, amount, note]) => (
                    <div key={name} className="rounded-xl bg-white p-3 shadow-sm">
                      <div className="flex items-center justify-between text-sm font-medium">
                        <span>{name}</span>
                        <span>{amount}</span>
                      </div>
                      <div className="mt-1 text-xs text-slate-500">{note}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-slate-100 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Workflow</div>
                <div className="mt-3 space-y-3">
                  {['Day 3: Friendly email reminder', 'Day 7: SMS follow-up', 'Day 15: Firm payment request', 'Day 30: Final notice + call task'].map((item) => (
                    <div key={item} className="rounded-xl bg-white p-3 text-sm shadow-sm">{item}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-6 px-6 py-14 md:grid-cols-3">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="rounded-3xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-xl font-semibold">{benefit.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{benefit.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how" className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-2xl">
            <div className="text-sm font-medium uppercase tracking-wide text-slate-500">How it works</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Launch a repeatable collections process in days, not months.</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {howItWorks.map((item) => (
              <div key={item.step} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">{item.step}</div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-900 text-white">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="max-w-3xl">
              <div className="text-sm font-medium uppercase tracking-wide text-slate-400">Why it converts</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">This is not invoice tracking. It is a cash recovery engine.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">RecoverAI combines workflows, prioritization, and payment-ready communication so your business can collect faster without more admin overhead.</p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                ['Automated reminders', 'Email and SMS flows that run on schedule.'],
                ['Smart prioritization', 'Focus your team where recovery probability is highest.'],
                ['Clear escalation paths', 'Move from friendly reminders to firm notices without chaos.'],
              ].map(([title, body]) => (
                <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <p className="mt-3 leading-7 text-slate-300">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-2xl">
            <div className="text-sm font-medium uppercase tracking-wide text-slate-500">Pricing</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Simple pricing that pays for itself with one recovered invoice.</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {pricing.map((plan) => (
              <div key={plan.name} className={`rounded-3xl border p-6 shadow-sm ${plan.featured ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-900'}`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  {plan.featured ? <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">Most Popular</span> : null}
                </div>
                <div className="mt-4 text-3xl font-semibold">{plan.price}</div>
                <ul className="mt-6 space-y-3 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature}>• {feature}</li>
                  ))}
                </ul>
                <a href="#cta" className={`mt-8 inline-block rounded-2xl px-5 py-3 text-sm font-medium transition ${plan.featured ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-slate-900 text-white hover:opacity-90'}`}>Start with {plan.name}</a>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <div className="max-w-2xl">
              <div className="text-sm font-medium uppercase tracking-wide text-slate-500">FAQ</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">Common questions</h2>
            </div>
            <div className="mt-10 space-y-4">
              {faq.map((item) => (
                <div key={item.q} className="rounded-3xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold">{item.q}</h3>
                  <p className="mt-2 leading-7 text-slate-600">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="cta" className="mx-auto max-w-5xl px-6 py-20">
          <div className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-2xl md:p-12">
            <div className="max-w-3xl">
              <div className="text-sm font-medium uppercase tracking-wide text-slate-400">Early access</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Stop leaving money on the table.</h2>
              <p className="mt-4 text-lg leading-8 text-slate-300">Book a demo and we’ll show you how to turn overdue invoices into a repeatable cash collection workflow.</p>
            </div>
            <LeadForm />
          </div>
        </section>
      </main>
    </div>
  );
}
