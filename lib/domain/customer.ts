export type CustomerId = string;

export type CustomerProfile = {
  id: CustomerId;
  name: string;
  phone: string;
  email?: string;
  city: string;
  avatarUrl?: string;
  portalEnabled: boolean;
  branchId?: string;
};
