import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { createTenantOnboarding } from '../lib/onboardingApi';
import type { TenantOnboardingRequest } from '../types/onboarding';
import Footer from '../components/Footer';

const initialForm: TenantOnboardingRequest = {
  companyName: '',
  tenantSlug: '',
  adminFullName: '',
  adminEmail: '',
  password: '',
  industry: 'Service Business',
  monthlyInvoiceVolume: ''
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export default function Onboarding() {
  const navigate = useNavigate();

  const [form, setForm] = useState<TenantOnboardingRequest>(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const updateForm = <K extends keyof TenantOnboardingRequest>(
    key: K,
    value: TenantOnboardingRequest[K]
  ) => {
    setForm((current) => {
      if (key === 'companyName') {
        return {
          ...current,
          companyName: value,
          tenantSlug: slugify(String(value))
        };
      }

      return {
        ...current,
        [key]: value
      };
    });

    setError('');
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    if (!form.companyName.trim()) {
      setError('Company name is required.');
      setSaving(false);
      return;
    }

    if (!form.adminEmail.trim()) {
      setError('Admin email is required.');
      setSaving(false);
      return;
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      setSaving(false);
      return;
    }

    try {
      await createTenantOnboarding(form);
      navigate('/login', {
        replace: true,
        state: {
          message: 'Workspace created. Sign in with your new admin account.'
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create workspace.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            Tenant Onboarding
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">
            Create your RecoverAI workspace
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Set up your business workspace and first admin user.
          </p>
        </div>

        <form onSubmit={submit} className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Company name"
              value={form.companyName}
              onChange={(value) => updateForm('companyName', value)}
              placeholder="Acme Studio"
            />

            <Field
              label="Workspace slug"
              value={form.tenantSlug}
              onChange={(value) => updateForm('tenantSlug', slugify(value))}
              placeholder="acme-studio"
            />

            <Field
              label="Admin full name"
              value={form.adminFullName}
              onChange={(value) => updateForm('adminFullName', value)}
              placeholder="Jane Smith"
            />

            <Field
              label="Admin email"
              value={form.adminEmail}
              onChange={(value) => updateForm('adminEmail', value)}
              placeholder="jane@company.com"
              type="email"
            />

            <Field
              label="Password"
              value={form.password}
              onChange={(value) => updateForm('password', value)}
              placeholder="At least 8 characters"
              type="password"
            />

            <Field
              label="Industry"
              value={form.industry}
              onChange={(value) => updateForm('industry', value)}
              placeholder="Service Business"
            />

            <Field
              label="Monthly invoice volume"
              value={form.monthlyInvoiceVolume}
              onChange={(value) => updateForm('monthlyInvoiceVolume', value)}
              placeholder="Example: 100 invoices / $85k monthly"
            />
          </div>

          {error ? (
            <p className="mt-6 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Link to="/demo" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Back to demo
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {saving ? 'Creating workspace...' : 'Create Workspace'}
            </button>
          </div>
        </form>
      </main>
       <div className="min-h-screen bg-slate-50 text-slate-900">  
            <Footer />
          </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text'
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
      />
    </label>

  );
}