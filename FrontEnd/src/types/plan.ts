export type PlanType = 'Free' | 'Pro' | 'Enterprise' | number;

export type PlanLimits = {
  plan: PlanType;
  isActive: boolean;

  customerLimit: number;
  invoiceLimit: number;
  reminderRunLimit: number;
  scoringRunLimit: number;

  customerCount: number;
  invoiceCount: number;
  reminderRunCount: number;
  scoringRunCount: number;

  canCreateCustomer: boolean;
  canCreateInvoice: boolean;
  canRunReminders: boolean;
  canRunScoring: boolean;
};

export type PaywallError = {
  message: string;
  feature: string;
  upgradeRequired: boolean;
};