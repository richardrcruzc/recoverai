import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Terms of Service
        </h1>

        <div className="mt-8 space-y-6 rounded-3xl bg-white p-6 leading-7 shadow-sm">
          <Section title="1. Overview">
            CollectFlowAI provides software that helps businesses manage outstanding invoices through automated workflows, communications, analytics, and recovery tracking.
          </Section>

          <Section title="2. Eligibility">
            You must be at least 18 years old and authorized to act on behalf of your business.
          </Section>

          <Section title="3. Service Scope">
            CollectFlowAIis a technology platform. CollectFlowAIdoes not act as a debt collector, law firm, financial institution, or legal representative.
          </Section>

          <Section title="4. User Responsibilities">
            You agree to provide accurate customer and invoice data, use the platform only for lawful business purposes, and ensure you have the legal right to contact your customers.
          </Section>

          <Section title="5. Prohibited Use">
            You may not use CollectFlowAIto harass, threaten, mislead, impersonate another entity, upload fraudulent data, or violate applicable laws.
          </Section>

          <Section title="6. Fees">
            CollectFlowAImay charge subscription fees or performance-based recovery fees. Fees are disclosed before use.
          </Section>

          <Section title="7. Data Ownership">
            You retain ownership of your business data. CollectFlowAIprocesses data to provide and improve the service.
          </Section>

          <Section title="8. Limitation of Liability">
            CollectFlowAIis not responsible for collection outcomes, customer disputes, lost revenue, or legal claims arising from your use of the platform.
          </Section>

          <Section title="9. Termination">
            CollectFlowAImay suspend or terminate accounts that violate these terms.
          </Section>

          <Section title="10. Governing Law">
            These terms are governed by the laws of the State of Florida, United States.
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