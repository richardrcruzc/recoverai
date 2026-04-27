export type ImportInvoicesResponse = {
  rowsRead: number;
  customersCreated: number;
  invoicesCreated: number;
  rowsSkipped: number;
  errors: string[];
};