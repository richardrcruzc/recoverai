export type LeadStage =
  | 'New'
  | 'Contacted'
  | 'Replied'
  | 'DemoScheduled'
  | 'Activated'
  | 'PayingCustomer'
  | 'Lost'
  | number;

export type Lead = {
  id: string;
  name: string;
  email: string;
  company?: string;

  stage: LeadStage;
  notes: string;

  lastContactedAtUtc?: string;
  lastRepliedAtUtc?: string;
};