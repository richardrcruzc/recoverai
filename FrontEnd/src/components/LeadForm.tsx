import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, CircleDollarSign, Mail, Phone, User } from 'lucide-react';
import type { FormErrors, LeadFormValues } from '../types';
import { submitLead } from '../lib/api';

const initialValues: LeadFormValues = { name: '', email: '', phone: '', company: '', invoiceVolume: '', biggestProblem: '' };

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validate(values: LeadFormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = 'Name is required.';
  if (!values.email.trim()) errors.email = 'Work email is required.';
  else if (!isValidEmail(values.email)) errors.email = 'Enter a valid email address.';
  if (!values.company.trim()) errors.company = 'Company name is required.';
  if (!values.invoiceVolume.trim()) errors.invoiceVolume = 'Please estimate overdue invoice volume.';
  if (!values.biggestProblem.trim()) errors.biggestProblem = 'Tell us your main collections challenge.';
  return errors;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-2 text-sm text-rose-300">{message}</p>;
}

function InputField({ label, value, onChange, placeholder, error, type = 'text', icon }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  type?: string;
  icon?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-200">{label}</span>
      <div className="flex items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-white/30">
        {icon ? <span className="mr-3 text-slate-400">{icon}</span> : null}
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none" />
      </div>
      <FieldError message={error} />
    </label>
  );
}

export default function LeadForm() {
  const navigate = useNavigate();
  const [values, setValues] = useState<LeadFormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const setField = <K extends keyof LeadFormValues>(key: K, value: LeadFormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setSubmitError('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setIsSubmitting(true);
      await submitLead(values);
      navigate('/thank-you');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Could not submit your request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="mt-8 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit} noValidate>
      <InputField label="Your name" value={values.name} onChange={(value) => setField('name', value)} placeholder="Jane Smith" error={errors.name} icon={<User className="h-4 w-4" />} />
      <InputField label="Work email" value={values.email} onChange={(value) => setField('email', value)} placeholder="jane@company.com" error={errors.email} type="email" icon={<Mail className="h-4 w-4" />} />
      <InputField label="Phone" value={values.phone} onChange={(value) => setField('phone', value)} placeholder="Optional" error={errors.phone} icon={<Phone className="h-4 w-4" />} />
      <InputField label="Company name" value={values.company} onChange={(value) => setField('company', value)} placeholder="Acme Studio" error={errors.company} icon={<Building2 className="h-4 w-4" />} />
      <InputField label="Estimated overdue invoices per month" value={values.invoiceVolume} onChange={(value) => setField('invoiceVolume', value)} placeholder="Example: 15 invoices / $25k overdue" error={errors.invoiceVolume} icon={<CircleDollarSign className="h-4 w-4" />} />
      <label className="block md:col-span-2">
        <span className="mb-2 block text-sm font-medium text-slate-200">Biggest collections problem</span>
        <textarea value={values.biggestProblem} onChange={(e) => setField('biggestProblem', e.target.value)} placeholder="Clients pay late, reminders are inconsistent, and cash flow is unpredictable." className="min-h-[140px] w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 focus:border-white/30 focus:outline-none" />
        <FieldError message={errors.biggestProblem} />
      </label>
      <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center md:justify-between">
        <div>{submitError ? <p className="text-sm text-rose-300">{submitError}</p> : <p className="text-sm text-slate-400">We’ll use this information to tailor your demo.</p>}</div>
        <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? 'Submitting...' : 'Request Demo'}
          {!isSubmitting ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
        </button>
      </div>
    </form>
  );
}
