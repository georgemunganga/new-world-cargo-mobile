import { laravelAccountSettingsRepository } from "@/lib/adapters/laravel/laravel-account-settings-adapter";
import { laravelAddressBookRepository } from "@/lib/adapters/laravel/laravel-address-book-adapter";
import { laravelAuthRepository } from "@/lib/adapters/laravel/laravel-auth-adapter";
import { laravelBillingActionsRepository } from "@/lib/adapters/laravel/laravel-billing-actions-adapter";
import { laravelBillingRepository } from "@/lib/adapters/laravel/laravel-billing-adapter";
import { laravelBookingRepository } from "@/lib/adapters/laravel/laravel-booking-adapter";
import { laravelCustomerRepository } from "@/lib/adapters/laravel/laravel-customer-adapter";
import { laravelPickupRepository } from "@/lib/adapters/laravel/laravel-pickup-adapter";
import { laravelNotificationPreferencesRepository } from "@/lib/adapters/laravel/laravel-notification-preferences-adapter";
import { laravelNotificationsRepository } from "@/lib/adapters/laravel/laravel-notifications-adapter";
import { laravelReturnRequestRepository } from "@/lib/adapters/laravel/laravel-return-request-adapter";
import { laravelShipmentRepository } from "@/lib/adapters/laravel/laravel-shipment-adapter";
import { laravelSupportRepository } from "@/lib/adapters/laravel/laravel-support-adapter";
import { laravelTrackingRepository } from "@/lib/adapters/laravel/laravel-tracking-adapter";
import { laravelUploadRepository } from "@/lib/adapters/laravel/laravel-upload-adapter";

export const repositories = {
  auth: laravelAuthRepository,
  customer: laravelCustomerRepository,
  shipments: laravelShipmentRepository,
  tracking: laravelTrackingRepository,
  billing: laravelBillingRepository,
  billingActions: laravelBillingActionsRepository,
  bookings: laravelBookingRepository,
  addressBook: laravelAddressBookRepository,
  support: laravelSupportRepository,
  returns: laravelReturnRequestRepository,
  pickups: laravelPickupRepository,
  accountSettings: laravelAccountSettingsRepository,
  notificationPreferences: laravelNotificationPreferencesRepository,
  notifications: laravelNotificationsRepository,
  uploads: laravelUploadRepository,
};
