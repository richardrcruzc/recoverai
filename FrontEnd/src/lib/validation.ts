import type { LeadFormErrors, LeadFormValues } from './types';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLeadForm(values: LeadFormValues): LeadFormErrors {
  const errors: LeadFormErrors = {};

  if (!values.name.trim()) errors.name = 'Name is required.';
  if (!values.email.trim()) errors.email = 'Work email is required.';
  else if (!emailRegex.test(values.email)) errors.email = 'Enter a valid email address.';
  if (!values.company.trim()) errors.company = 'Company name is required.';
  if (!values.invoiceVolume.trim()) errors.invoiceVolume = 'Please estimate overdue invoice volume.';
  if (!values.biggestProblem.trim()) errors.biggestProblem = 'Tell us your main collections challenge.';

  return errors;
}
