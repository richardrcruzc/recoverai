export type CollectionActionType =
  | 'EmailReminder'
  | 'CallTask'
  | 'FinalNotice'
  | 'EscalationReview'
  | 'Wait'
  | number;

export type CollectionActionStatus =
  | 'Pending'
  | 'Completed'
  | 'Failed'
  | 'Skipped'
  | number;

export type CollectionAction = {
  id: string;
  invoiceId: string;
  customerId: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  actionType: CollectionActionType;
  status: CollectionActionStatus;
  title: string;
  message: string;
  reason: string;
  scheduledForUtc: string;
  completedAtUtc?: string | null;
  errorMessage: string;
};

export type RunCollectionsEngineResponse = {
  evaluatedInvoices: number;
  actionsCreated: number;
  emailsSent: number;
  callTasksCreated: number;
  skipped: number;
  failed: number;
};