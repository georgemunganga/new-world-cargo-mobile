export type CustomerId = string;

export type CustomerProfile = {
  id: CustomerId;
  name: string;
  phone: string;
  email?: string;
  city: string;
  avatarUrl?: string;
  /** Server-confirmed contact verification. Never assume true. */
  verified?: boolean;
  portalEnabled: boolean;
  branchId?: string;
};
