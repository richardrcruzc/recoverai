export type LeadFormValues = {
  name: string;
  email: string;
  phone: string;
  company: string;
  invoiceVolume: string;
  biggestProblem: string;
};

export type FormErrors = Partial<Record<keyof LeadFormValues, string>>;
