import { useNavigate } from 'react-router-dom';

type Props = {
  open: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
};

export default function UpgradeModal({
  open,
  title = 'Upgrade required',
  message = 'You reached the free plan limit. Upgrade to Pro to continue.',
  onClose
}: Props) {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>

        <p className="mt-3 leading-7 text-slate-600">{message}</p>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
          Pro includes unlimited customers, unlimited invoices, automated reminders, AI scoring, and recovery analytics.
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-900"
          >
            Not now
          </button>

          <button
            type="button"
            onClick={() => navigate('/billing')}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white"
          >
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  );
}