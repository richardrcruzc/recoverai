export type CollectionPriority = 'Low' | 'Medium' | 'High' | 'Critical' | number;

export type InvoiceScore = {
  id: string;
  invoiceId: string;
  customerId: string;
  invoiceNumber: string;
  customerName: string;
  customerCompanyName: string;
  score: number;
  priority: CollectionPriority;
  daysOverdue: number;
  balance: number;
  reminderCount: number;
  paymentCount: number;
  reason: string;
  createdAtUtc: string;
  updatedAtUtc?: string | null;
};

export type RunScoringResponse = {
  evaluatedInvoices: number;
  scoresCreated: number;
  scoresUpdated: number;
};