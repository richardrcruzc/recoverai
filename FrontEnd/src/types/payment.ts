export type Payment = {
  id: string;
  tenantId: string;
  invoiceId: string;
  customerId: string;
  invoiceNumber: string;
  customerName: string;
  customerCompanyName: string;
  amount: number;
  currency: string;
  paymentDate: string;
  referenceNumber: string;
  notes: string;
  createdAtUtc: string;
};

export type CreatePaymentRequest = {
  invoiceId: string;
  amount: number;
  currency: string;
  paymentDate: string;
  referenceNumber: string;
  notes: string;
};