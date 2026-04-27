export type OutboundContact = {
  id: string;
  companyName: string;
  website: string;
  industry: string;
  contactName: string;
  title: string;
  email: string;
  linkedInUrl: string;
  score: number;
  status: string;
  isUnsubscribed: boolean;
};

export type OutboundEmailSend = {
  id: string;
  contactId: string;
  campaignId: string;
  companyName: string;
  contactName: string;
  email: string;
  campaignName: string;
  providerMessageId: string;
  status: string;
  sentAtUtc?: string | null;
  deliveredAtUtc?: string | null;
  openedAtUtc?: string | null;
  clickedAtUtc?: string | null;
  bouncedAtUtc?: string | null;
  lastEvent: string;
};

export type SendCampaignResponse = {
  sent: number;
};