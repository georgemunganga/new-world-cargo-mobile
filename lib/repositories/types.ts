import type { AuthSession, ChangePasswordInput, OtpChallenge, PasswordResetInput, PasswordResetRequestInput, RegisterCustomerInput, SignInInput, VerifyOtpInput } from "@/lib/domain/auth";
import type { CustomerProfile } from "@/lib/domain/customer";
import type { ConfirmInvoicePaymentInput, ConfirmInvoicePaymentResult, CustomerInvoice, PaymentMethod, SavedPaymentMethod, WalletSnapshot } from "@/lib/domain/billing";
import type { BookingDraftSummary, BookingSubmissionInput, BookingSubmissionResult } from "@/lib/domain/booking";
import type { AccountSettingsSnapshot } from "@/lib/domain/account-settings";
import type { Pickup } from "@/lib/domain/pickup";
import type { ReturnRequest, SubmitReturnRequestInput } from "@/lib/domain/return-request";
import type { CustomerShipment } from "@/lib/domain/shipment";
import type { CreateSupportCaseInput, SupportCase } from "@/lib/domain/support";
import type { TrackingResult } from "@/lib/domain/tracking";
import type { UploadedDocument, UploadFile } from "@/lib/domain/upload";
import type { AddressBookItem, AddressBookKind } from "@/lib/domain/address-book";

export type AuthRepository = {
  signIn(input: SignInInput): Promise<AuthSession>;
  register(input: RegisterCustomerInput): Promise<OtpChallenge>;
  verifyOtp(input: VerifyOtpInput): Promise<AuthSession>;
  requestPasswordReset(input: PasswordResetRequestInput): Promise<OtpChallenge>;
  resetPassword(input: PasswordResetInput): Promise<void>;
  changePassword(input: ChangePasswordInput): Promise<void>;
  resendOtp(challengeId: string): Promise<OtpChallenge>;
  restoreSession(): Promise<AuthSession | null>;
  signOut(): Promise<void>;
};

export type CustomerRepository = {
  getProfile(): Promise<CustomerProfile>;
  updateProfile(input: Partial<Pick<CustomerProfile, "name" | "phone" | "city" | "avatarUrl">>): Promise<CustomerProfile>;
};

export type ShipmentRepository = {
  listShipments(): Promise<CustomerShipment[]>;
  getShipment(id: string): Promise<CustomerShipment | null>;
};

export type TrackingRepository = {
  trackByCode(code: string): Promise<TrackingResult>;
};

export type BillingRepository = {
  listInvoices(): Promise<CustomerInvoice[]>;
  getInvoice(id: string): Promise<CustomerInvoice | null>;
};

export type BillingActionsRepository = {
  listPaymentMethods(): Promise<SavedPaymentMethod[]>;
  savePaymentMethod(method: Exclude<PaymentMethod, "wallet">): Promise<SavedPaymentMethod>;
  removePaymentMethod(methodId: string): Promise<void>;
  setDefaultPaymentMethod(methodId: string): Promise<SavedPaymentMethod[]>;
  getWallet(): Promise<WalletSnapshot>;
  topUpWallet(amount: number): Promise<WalletSnapshot>;
  confirmInvoicePayment(input: ConfirmInvoicePaymentInput): Promise<ConfirmInvoicePaymentResult>;
  setInvoiceReminder(invoiceId: string, enabled: boolean): Promise<void>;
  disputeInvoice(invoiceId: string): Promise<CustomerInvoice["resolution"]>;
};

export type BookingRepository = {
  listDrafts(): Promise<BookingDraftSummary[]>;
  submitBooking(input: BookingSubmissionInput): Promise<BookingSubmissionResult>;
};

export type AddressBookRepository = {
  listRecipients(): Promise<AddressBookItem[]>;
  listSavedPlaces(): Promise<AddressBookItem[]>;
  saveDirectoryItem(kind: AddressBookKind, item: Omit<AddressBookItem, "id"> & { id?: string }): Promise<AddressBookItem>;
  removeDirectoryItem(kind: AddressBookKind, id: string): Promise<void>;
};

export type SupportRepository = {
  listCases(): Promise<SupportCase[]>;
  createCase(input: CreateSupportCaseInput): Promise<SupportCase>;
};

export type ReturnRequestRepository = {
  listRequests(): Promise<ReturnRequest[]>;
  submitReturn(input: SubmitReturnRequestInput): Promise<ReturnRequest>;
};

export type PickupRepository = {
  listPickups(): Promise<Pickup[]>;
  reschedulePickup(shipmentId: string, slotId: string): Promise<Pickup | null>;
  cancelPickup(shipmentId: string): Promise<Pickup | null>;
  requestPickupHelp(shipmentId: string): Promise<Pickup | null>;
  restorePickup(shipmentId: string): Promise<Pickup | null>;
};

export type AccountSettingsRepository = {
  getSettings(): Promise<AccountSettingsSnapshot>;
  revokeDevice(id: string): Promise<AccountSettingsSnapshot>;
  setMarketingEnabled(enabled: boolean): Promise<AccountSettingsSnapshot>;
  requestDataExport(): Promise<AccountSettingsSnapshot>;
  requestAccountDeletion(): Promise<AccountSettingsSnapshot>;
};

export type UploadRepository = {
  uploadProfilePhoto(file: UploadFile): Promise<UploadedDocument>;
};
