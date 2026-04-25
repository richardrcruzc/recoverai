export type LeadFormValues = {
  name: string;
  email: string;
  phone: string;
  company: string;
  invoiceVolume: string;
  biggestProblem: string;
};

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  invoiceVolume: string;
  biggestProblem: string;
  source: string;
  status: string | number;
  createdAtUtc: string;
};

export type FormErrors = Partial<Record<keyof LeadFormValues, string>>;
