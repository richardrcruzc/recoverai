import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AcceptableUse() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Acceptable Use Policy
        </h1>

        <div className="mt-8 space-y-6 rounded-3xl bg-white p-6 leading-7 shadow-sm">
          <Section title="Permitted Use">
            CollectFlowAI may be used for lawful accounts receivable automation, invoice follow-up, payment tracking, business communications, and recovery workflow management.
          </Section>

          <Section title="Prohibited Conduct">
            You may not use CollectFlowAI to harass, threaten, mislead, impersonate, shame, intimidate, or unlawfully pressure recipients.
          </Section>

          <Section title="Communication Rules">
            Communications must be truthful, professional, relevant to a valid business relationship, and compliant with applicable laws.
          </Section>

          <Section title="Data Rules">
            You may not upload fraudulent, stolen, unlawful, or unauthorized customer or invoice data.
          </Section>

          <Section title="Consumer Debt">
            CollectFlowAI is intended as business accounts receivable automation. If you use it for consumer debt, you are responsible for complying with applicable debt collection laws.
          </Section>

          <Section title="Enforcement">
            CollectFlowAI may suspend or terminate accounts that violate this policy.
          </Section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-slate-600">{children}</p>
    </section>
  );
}