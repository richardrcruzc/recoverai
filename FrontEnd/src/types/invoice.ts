export type InvoiceStatus = 'Draft' | 'Sent' | 'PartiallyPaid' | 'Paid' | 'Overdue' | 'WrittenOff' | number;

export type Invoice = {
  id: string;
  tenantId: string;
  customerId: string;
  customerName: string;
  customerCompanyName: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  balance: number;
  currency: string;
  status: InvoiceStatus;
  daysOverdue: number;
  createdAtUtc: string;
};

export type CreateInvoiceRequest = {
  tenantId: string;
  customerId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  balance: number;
  currency: string; 
};
