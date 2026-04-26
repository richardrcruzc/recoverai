import { Link } from 'react-router-dom';
import Header from '../components/Header';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <section className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
              No upfront software fee · Pay only when recovery happens
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Recover unpaid invoices automatically.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              RecoverAI helps service businesses prioritize overdue invoices, automate professional follow-ups, track payments, and recover cash without awkward client chasing.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/onboarding"
                className="rounded-2xl bg-slate-900 px-6 py-3 text-center text-sm font-medium text-white shadow-sm transition hover:opacity-90"
              >
                Get Free Recovery Audit
              </Link>

              <Link
                to="/demo"
                className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-center text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-50"
              >
                See Demo Priority Queue
              </Link>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Setup takes under 2 minutes. No credit card required.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl sm:p-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <div className="text-sm font-medium text-slate-500">Revenue at risk</div>
                <div className="mt-1 text-3xl font-semibold">$84,250</div>
              </div>
              <div className="rounded-2xl bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700">
                12 priority accounts
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {[
                ['88', 'Critical', 'INV-1001', 'Acme Studio', '$6,800', '32 days overdue'],
                ['71', 'High', 'INV-1002', 'NorthPeak IT', '$1,900', '18 days overdue'],
                ['49', 'Medium', 'INV-1003', 'Blue Harbor', '$1,450', '7 days overdue']
              ].map(([score, priority, invoice, customer, balance, age]) => (
                <div key={invoice} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">{invoice}</div>
                      <div className="text-sm text-slate-500">{customer}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">{score}</div>
                      <div className="text-xs text-slate-500">score</div>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-slate-900 px-3 py-1 font-medium text-white">{priority}</span>
                    <span className="rounded-full bg-white px-3 py-1 text-slate-600">{balance}</span>
                    <span className="rounded-full bg-white px-3 py-1 text-slate-600">{age}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Get your free invoice recovery audit
          </h2>
          <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-600">
            Enter your business details, add a few overdue invoices, and RecoverAI will show which accounts to prioritize first.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <AuditCard title="Find cash at risk" text="See overdue balance and highest-risk accounts." />
            <AuditCard title="Prioritize action" text="AI scoring ranks which invoices need attention first." />
            <AuditCard title="Recover faster" text="Automated reminders help keep follow-up consistent." />
          </div>

          <Link
            to="/onboarding"
            className="mt-8 inline-block rounded-2xl bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
          >
            Start Free Audit
          </Link>
        </section>

        <section className="mt-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Invoices usually go unpaid because follow-up breaks down.
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Teams get busy, reminders become inconsistent, and nobody knows which account should be contacted first.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <ProblemCard title="Manual chasing" text="Your team spends time writing reminders instead of doing billable work." />
            <ProblemCard title="No priority system" text="High-risk invoices are mixed with low-risk accounts." />
            <ProblemCard title="Weak visibility" text="You cannot clearly see recovered cash, outstanding balance, or follow-up status." />
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] bg-slate-900 p-6 text-white shadow-xl sm:p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                RecoverAI turns collections into a repeatable workflow.
              </h2>
              <p className="mt-4 leading-7 text-slate-300">
                Add invoices, get an AI-powered priority queue, send structured reminders, and track recovered payments from one dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FeatureCard title="AI scoring" text="Know who to contact first." />
              <FeatureCard title="Automated reminders" text="Send consistent, professional follow-ups." />
              <FeatureCard title="Payment tracking" text="Record recoveries and update balances." />
              <FeatureCard title="Recovery analytics" text="Measure collections performance." />
            </div>
          </div>
        </section>

        <section className="mt-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              How it works
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              The workflow is simple: identify, prioritize, follow up, and track recovery.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
            <Step number="1" title="Add invoices" text="Enter overdue invoices or import them later." />
            <Step number="2" title="Run scoring" text="RecoverAI ranks accounts by urgency and balance." />
            <Step number="3" title="Send reminders" text="Use structured follow-ups to reduce manual chasing." />
            <Step number="4" title="Track payments" text="Record recovered cash and see performance." />
          </div>
        </section>

        <section className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-semibold">Before RecoverAI</h2>
            <ul className="mt-5 space-y-3 text-slate-600">
              <li>• Invoices followed up manually</li>
              <li>• No clear priority queue</li>
              <li>• Awkward client conversations</li>
              <li>• Cash flow uncertainty</li>
            </ul>
          </div>

          <div className="rounded-[2rem] border-2 border-slate-900 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-semibold">After RecoverAI</h2>
            <ul className="mt-5 space-y-3 text-slate-600">
              <li>• AI ranks overdue invoices</li>
              <li>• Follow-ups become consistent</li>
              <li>• Payments are tracked automatically</li>
              <li>• Recovered cash is visible in one dashboard</li>
            </ul>
          </div>
        </section>

        <section id="pricing" className="mt-20 scroll-mt-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Pricing built to align with your success
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              No upfront software fee. A recovery fee applies only to successfully recovered payments.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-3xl rounded-[2rem] border-2 border-slate-900 bg-white p-6 shadow-xl sm:p-8">
            <div className="text-center">
              <h3 className="text-2xl font-semibold">Performance-Based Plan</h3>
              <div className="mt-4 text-5xl font-bold">$0 upfront</div>
              <p className="mt-3 text-slate-600">
                Small percentage only on successfully recovered payments.
              </p>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-100 p-5 text-center text-sm font-medium text-slate-700">
              RecoverAI makes money only when recovery happens.
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                'AI collection priority scoring',
                'Automated invoice reminders',
                'Payment tracking dashboard',
                'Recovery analytics and reporting',
                'Reminder logs and audit trail',
                'No long-term contract'
              ].map((feature) => (
                <div key={feature} className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-700">
                  ✓ {feature}
                </div>
              ))}
            </div>

            <p className="mt-6 text-center text-sm leading-6 text-slate-500">
              Public pricing statement: no upfront software fee. A recovery fee applies only to successfully recovered payments.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/onboarding"
                className="rounded-2xl bg-slate-900 px-6 py-3 text-center text-sm font-medium text-white shadow-sm transition hover:opacity-90"
              >
                Start Recovering Now
              </Link>

              <Link
                to="/demo"
                className="rounded-2xl border border-slate-300 px-6 py-3 text-center text-sm font-medium text-slate-900 transition hover:bg-slate-50"
              >
                Try Demo First
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] bg-white p-6 text-center shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Every day unpaid invoices sit, recovery gets harder.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            Start with a free recovery audit, see your priority queue, and decide whether automation makes sense for your business.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/onboarding"
              className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-medium text-white"
            >
              Get Free Recovery Audit
            </Link>

            <Link
              to="/demo"
              className="rounded-2xl border border-slate-300 px-6 py-3 text-sm font-medium"
            >
              View Demo
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

function AuditCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function ProblemCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function FeatureCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-5">
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
    </div>
  );
}

function Step({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
        {number}
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}