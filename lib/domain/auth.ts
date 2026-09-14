import type { CustomerProfile } from "./customer";

export type AuthIdentifier = { type: "email" | "phone"; value: string };

export type AuthSession = {
  token?: string;
  csrfToken?: string;
  refreshToken?: string;
  expiresAt?: string;
  customer: CustomerProfile;
};

export type SignInInput = {
  identifier: string;
  password: string;
  remember?: boolean;
};

export type RegisterCustomerInput = {
  name: string;
  email: string;
  phone: string;
  city: string;
  password: string;
};

export type OtpPurpose = "sign-in" | "register" | "password-reset";

export type OtpChallenge = {
  id: string;
  destination: string;
  channel: "email" | "phone";
  purpose: OtpPurpose;
  expiresAt?: string;
  resendAfterSeconds: number;
  sessionToken?: string;
  csrfToken?: string;
  sessionExpiresAt?: string;
};

export type VerifyOtpInput = {
  challengeId: string;
  code: string;
};

export type PasswordResetRequestInput = {
  identifier: string;
};

export type PasswordResetInput = {
  challengeId: string;
  code: string;
  password: string;
};

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};
