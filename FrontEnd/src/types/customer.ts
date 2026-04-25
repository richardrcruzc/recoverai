export type Customer = {
  id: string;
  tenantId: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  notes: string;
  createdAtUtc: string;
};

export type CreateCustomerRequest = {
  tenantId: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  notes: string;
};
