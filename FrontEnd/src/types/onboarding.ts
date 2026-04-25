export type TenantOnboardingRequest = {
  companyName: string;
  tenantSlug: string;
  adminFullName: string;
  adminEmail: string;
  password: string;
  industry: string;
  monthlyInvoiceVolume: string;
};

export type TenantOnboardingResponse = {
  tenantId: string;
  tenantName: string;
  adminEmail: string;
};