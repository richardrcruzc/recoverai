import Header from '../components/Header';

export default function Compliance() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-semibold">Compliance Guidelines</h1>

        <div className="mt-6 space-y-6 rounded-3xl bg-white p-6 leading-7 shadow-sm">
          <p>
            CollectFlowAI is designed to support professional, respectful, and documented invoice follow-up workflows.
          </p>

          <h2 className="text-xl font-semibold">Communication Standards</h2>
          <p>
            Users should avoid harassment, misleading statements, public disclosure of debt, excessive contact frequency, or threats not authorized by law or contract.
          </p>

          <h2 className="text-xl font-semibold">Business Use</h2>
          <p>
            Users should confirm that each invoice is valid, accurate, and authorized for follow-up before using automation.
          </p>

          <h2 className="text-xl font-semibold">Review Required</h2>
          <p>
            Collection rules vary by jurisdiction and context. Users should consult qualified legal counsel where appropriate.
          </p>
        </div>
      </main>
    </div>
  );
}