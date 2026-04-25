export type LeadFormValues = {
  name: string;
  email: string;
  phone: string;
  company: string;
  invoiceVolume: string;
  biggestProblem: string;
};

export type LeadFormErrors = Partial<Record<keyof LeadFormValues, string>>;
