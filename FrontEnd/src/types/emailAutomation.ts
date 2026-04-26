export type EmailAutomationStatus = 'Pending' | 'Sent' | 'Failed' | 'Skipped' | number;

export type EmailAutomationJob = {
  id: string;
  tenantId?: string | null;
  leadId?: string | null;
  campaignKey: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  scheduledForUtc: string;
  sentAtUtc?: string | null;
  status: EmailAutomationStatus;
  errorMessage: string;
};

export type RunEmailAutomationResponse = {
  evaluatedJobs: number;
  sent: number;
  failed: number;
  skipped: number;
};