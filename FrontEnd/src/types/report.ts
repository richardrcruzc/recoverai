export type RecoverySummary = {
  totalInvoiced: number;
  totalOutstanding: number;
  totalCollected: number;
  overdueBalance: number;

  paidInvoices: number;
  overdueInvoices: number;

  collectionRate: number;

  totalInvoices: number;
  totalPayments: number;
};