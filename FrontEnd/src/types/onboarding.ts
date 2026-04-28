export type TenantOnboardingRequest = {
  companyName: string;
  tenantSlug: string;
  adminFullName: string;
  adminEmail: string;
  password: string;
  industry: string;
  monthlyInvoiceVolume: string;

   acceptTerms: boolean;
  acceptPrivacy: boolean;
  acceptCommunicationAuthorization: boolean;
};

export type TenantOnboardingResponse = {
  tenantId: string;
  tenantName: string;
  adminEmail: string;
};