import { Link } from 'react-router-dom';
import Header from '../components/Header';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

        {/* HERO */}
        <section className="text-center">
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Stop chasing unpaid invoices.
            <br />
            <span className="text-slate-600">Recover cash automatically.</span>
          </h1>

          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            RecoverAI helps service businesses automate follow-ups,
            prioritize overdue accounts, and get paid faster — without
            uncomfortable client chasing.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/demo" className="rounded-2xl bg-slate-900 px-6 py-3 text-white font-medium">
              Try Live Demo
            </Link>

            <Link to="/onboarding" className="rounded-2xl border border-slate-300 px-6 py-3 font-medium">
              Start Free Setup
            </Link>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            No credit card required · Setup in under 2 minutes
          </p>
        </section>

        {/* SOCIAL PROOF */}
        <section className="mt-16 text-center">
          <p className="text-sm text-slate-500 uppercase tracking-wide">
            Trusted by service businesses
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 text-slate-500 text-sm">
            <div>Agencies</div>
            <div>Consultants</div>
            <div>IT Services</div>
            <div>Legal Firms</div>
          </div>
        </section>

        {/* PROBLEM */}
        <section className="mt-16 text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            You’re not losing money.
            <br />
            <span className="text-slate-600">You’re losing follow-ups.</span>
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Card text="Invoices sit unpaid for weeks" />
            <Card text="Follow-ups are inconsistent" />
            <Card text="Chasing clients feels awkward" />
          </div>
        </section>

        {/* BEFORE / AFTER */}
        <section className="mt-16 grid gap-6 sm:grid-cols-2">
          <Box title="Before RecoverAI">
            <ul className="space-y-2 text-sm text-slate-600">
              <li>Manual reminders</li>
              <li>No prioritization</li>
              <li>Lost revenue</li>
              <li>Cash flow uncertainty</li>
            </ul>
          </Box>

          <Box title="After RecoverAI">
            <ul className="space-y-2 text-sm text-slate-600">
              <li>Automated reminders</li>
              <li>AI priority queue</li>
              <li>More recovered cash</li>
              <li>Predictable cash flow</li>
            </ul>
          </Box>
        </section>

        {/* SOLUTION */}
        <section className="mt-16 text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            Everything you need to recover invoices
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Feature title="AI Scoring" desc="Know exactly who to collect first" />
            <Feature title="Automated Reminders" desc="Follow-ups sent automatically" />
            <Feature title="Payments Tracking" desc="See what’s paid instantly" />
            <Feature title="Analytics" desc="Track recovery performance" />
          </div>
        </section>

        {/* METRICS */}
        <section className="mt-16 bg-white rounded-3xl p-8 shadow text-center">
          <h2 className="text-2xl font-semibold">
            Built for measurable results
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Metric value="+30%" label="Faster payments" />
            <Metric value="-70%" label="Manual follow-ups" />
            <Metric value="+20%" label="Recovered revenue" />
          </div>
        </section>

        {/* PRICING */}
       <section id="pricing" className="mt-20 text-center scroll-mt-24">
  <h2 className="text-2xl font-semibold sm:text-3xl">
    Pricing built to align with your success
  </h2>

  <p className="mt-4 max-w-2xl mx-auto text-slate-600">
    You don’t pay to use RecoverAI.
    You only pay when we help you recover money.
  </p>

  <div className="mt-10 max-w-2xl mx-auto rounded-3xl border-2 border-slate-900 bg-white p-8 shadow">

    <h3 className="text-2xl font-semibold">
      Performance-Based Plan
    </h3>

    <div className="mt-4 text-4xl font-bold">
      0$ upfront
    </div>

    <p className="mt-2 text-slate-600">
      + small % only on recovered invoices
    </p>

    {/* Key Value */}
    <div className="mt-6 rounded-2xl bg-slate-100 p-4 text-sm text-slate-700">
      We only make money when you recover money.
    </div>

    {/* Features */}
    <ul className="mt-6 text-left space-y-3 text-slate-600">
      <li>✔ AI scoring to prioritize collections</li>
      <li>✔ Automated invoice reminders</li>
      <li>✔ Payment tracking dashboard</li>
      <li>✔ Recovery analytics & reporting</li>
      <li>✔ Priority collection queue</li>
      <li>✔ No contracts, cancel anytime</li>
    </ul>

    {/* Important clarification */}
    <div className="mt-6 text-sm text-slate-500">
      You are never charged.  
      Fees are applied only when debts are successfully recovered.
    </div>

    {/* CTA */}
    <Link
      to="/onboarding"
      className="block mt-8 rounded-2xl bg-slate-900 px-6 py-3 text-white font-medium"
    >
      Start Recovering Now
    </Link>

    {/* Secondary CTA */}
    <Link
      to="/demo"
      className="block mt-3 text-sm text-slate-600 underline"
    >
      Try Demo First
    </Link>
  </div>
</section>

        {/* FINAL CTA */}
        <section className="mt-16 text-center">
          <h2 className="text-2xl font-semibold">
            Start recovering your invoices today
          </h2>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/onboarding" className="rounded-2xl bg-slate-900 px-6 py-3 text-white font-medium">
              Create Workspace
            </Link>

            <Link to="/demo" className="rounded-2xl border border-slate-300 px-6 py-3 font-medium">
              Try Demo First
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}

/* COMPONENTS */

function Card({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-sm text-slate-700">
      {text}
    </div>
  );
}

function Box({ title, children }: any) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}

function Feature({ title, desc }: any) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-slate-600 mt-2">{desc}</div>
    </div>
  );
}

function Metric({ value, label }: any) {
  return (
    <div className="rounded-2xl bg-slate-100 p-5">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-slate-600 mt-1">{label}</div>
    </div>
  );
}

function PriceCard({ title, price, features, highlight }: any) {
  return (
    <div className={`rounded-3xl p-6 shadow ${
      highlight ? 'border-2 border-slate-900 bg-white' : 'border border-slate-200 bg-white'
    }`}>
      <h3 className="text-xl font-semibold">{title}</h3>
      <div className="text-3xl font-bold mt-3">{price}</div>

      <ul className="mt-6 text-sm text-slate-600 space-y-2">
        {features.map((f: string) => <li key={f}>• {f}</li>)}
      </ul>

      <Link
        to="/onboarding"
        className="block mt-6 rounded-2xl bg-slate-900 text-white py-3 text-center"
      >
        Get Started
      </Link>
    </div>
  );
}