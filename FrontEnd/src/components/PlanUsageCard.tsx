import { useEffect, useState } from 'react';
import { getPlanLimits } from '../lib/planApi';
import type { PlanLimits } from '../types/plan';

function label(value: number) {
  return value < 0 ? 'Unlimited' : value;
}

function percent(count: number, limit: number) {
  if (limit < 0) return 0;
  if (limit === 0) return 100;
  return Math.min(100, Math.round((count / limit) * 100));
}

export default function PlanUsageCard() {
  const [limits, setLimits] = useState<PlanLimits | null>(null);

  useEffect(() => {
    getPlanLimits().then(setLimits).catch(() => setLimits(null));
  }, []);

  if (!limits) return null;

  const rows = [
    ['Customers', limits.customerCount, limits.customerLimit],
    ['Invoices', limits.invoiceCount, limits.invoiceLimit],
    ['Reminder Runs Today', limits.reminderRunCount, limits.reminderRunLimit],
    ['Scoring Runs Today', limits.scoringRunCount, limits.scoringRunLimit]
  ] as const;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <div className="text-sm font-medium uppercase tracking-wide text-slate-500">
            Current Plan
          </div>
          <div className="mt-1 text-2xl font-semibold">{String(limits.plan)}</div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {rows.map(([name, count, limit]) => (
          <div key={name}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-slate-600">{name}</span>
              <span className="font-medium text-slate-900">
                {count} / {label(limit)}
              </span>
            </div>

            {limit >= 0 ? (
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-slate-900"
                  style={{ width: `${percent(count, limit)}%` }}
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}