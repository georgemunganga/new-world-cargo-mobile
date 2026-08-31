import type { AppIconName } from "@/components/ui/app-icon";

export type MockPermission = "location" | "camera" | "photos" | "contacts" | "notifications" | "biometrics";
export type MockPermissionStatus = "not_requested" | "granted" | "denied";

export const mockPermissions: Record<MockPermission, { title: string; summary: string; purpose: string; manualAlternative: string; icon: AppIconName }> = {
  location: { title: "Location", summary: "Use your location to find nearby pickup points and refine your address.", purpose: "We only ask when you choose to use your current location for pickup or delivery.", manualAlternative: "You can always search by area, road, landmark, branch, or warehouse instead.", icon: "map-marker-outline" },
  camera: { title: "Camera", summary: "Add a parcel photo when a clear visual description is useful.", purpose: "We only ask when you tap Add parcel photo in a booking.", manualAlternative: "You can describe the parcel and handling needs without a photo.", icon: "camera-outline" },
  photos: { title: "Photo library", summary: "Choose an existing parcel or document photo from your device.", purpose: "We only ask when you choose a saved photo to support your booking.", manualAlternative: "You can continue without attaching a photo or document.", icon: "image-outline" },
  contacts: { title: "Contacts", summary: "Select a receiver from your phone instead of typing contact details.", purpose: "We only ask when you tap Choose from contacts for a sender or receiver.", manualAlternative: "You can enter the receiver name and phone number manually.", icon: "account-multiple-outline" },
  notifications: { title: "Notifications", summary: "Receive shipment, collection, delivery, and bill updates.", purpose: "We only ask after you choose to turn on operational updates.", manualAlternative: "You can check the in-app notification inbox whenever you prefer.", icon: "bell-outline" },
  biometrics: { title: "Face ID or fingerprint", summary: "Use your device’s secure unlock method when protecting account access.", purpose: "We only ask if you choose biometric sign-in after your account is set up.", manualAlternative: "You can continue with phone verification and a secure sign-in method.", icon: "fingerprint" },
};

export function permissionStatusLabel(status: MockPermissionStatus) {
  return { not_requested: "Not requested", granted: "Allowed for preview", denied: "Not allowed" }[status];
}
