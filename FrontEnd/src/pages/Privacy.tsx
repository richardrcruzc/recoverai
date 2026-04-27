import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Privacy Policy
        </h1>

        <div className="mt-8 space-y-6 rounded-3xl bg-white p-6 leading-7 shadow-sm">
          <Section title="1. Information We Collect">
            We may collect business account data, customer contact information, invoice data, payment data, usage data, and technical logs.
          </Section>

          <Section title="2. How We Use Information">
            We use information to provide services, automate invoice reminders, track recovery activity, improve the platform, and protect system security.
          </Section>

          <Section title="3. Data Sharing">
            We do not sell personal data. We may share data with service providers such as hosting providers, email delivery providers, payment processors, analytics tools, and security vendors.
          </Section>

          <Section title="4. Data Security">
            We use reasonable administrative, technical, and organizational safeguards to protect data, including access controls and encrypted communications.
          </Section>

          <Section title="5. Data Retention">
            We retain data as long as needed to provide the service, comply with legal obligations, resolve disputes, and enforce agreements.
          </Section>

          <Section title="6. Your Rights">
            You may request access, correction, export, or deletion of your information, subject to legal and operational requirements.
          </Section>

          <Section title="7. Cookies and Analytics">
            We may use cookies and analytics technologies for authentication, usage measurement, and product improvement.
          </Section>

          <Section title="8. Contact">
            For privacy questions, contact privacy@recoverai.net.
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