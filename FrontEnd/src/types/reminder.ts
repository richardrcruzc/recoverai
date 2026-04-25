export type ReminderStatus = 'Pending' | 'Sent' | 'Failed' | 'Skipped' | number;

export type RunReminderRequest = {
  minimumDaysOverdue: number;
  sendEmails: boolean;
};

export type RunReminderResponse = {
  evaluatedInvoices: number;
  remindersCreated: number;
  remindersSent: number;
  remindersFailed: number;
};

export type ReminderLog = {
  id: string;
  invoiceId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  invoiceNumber: string;
  channel: string;
  subject: string;
  status: ReminderStatus;
  createdAtUtc: string;
  sentAtUtc?: string | null;
  errorMessage: string;
};