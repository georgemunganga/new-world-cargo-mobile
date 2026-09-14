import { Platform } from "react-native";
import { normaliseZambianPhone } from "@/lib/auth-flow";
import { nativeSuccess, nativeUnavailable, type NativeServiceResult } from "./native-service-result";

type ExpoContact = {
  name?: string;
  firstName?: string;
  lastName?: string;
  phoneNumbers?: Array<{ number?: string }>;
};

type ExpoContactsModule = {
  requestPermissionsAsync?: () => Promise<{ status: string }>;
  presentContactPickerAsync?: () => Promise<ExpoContact | null>;
};

export type DeviceContact = {
  name: string;
  phone: string;
};

function loadExpoContacts(): ExpoContactsModule | null {
  try {
    // Optional native dependency. Keeps web/tests safe and lets production builds
    // use expo-contacts when it is installed in the native runtime.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require("expo-contacts") as ExpoContactsModule;
  } catch {
    return null;
  }
}

function contactName(contact: ExpoContact) {
  const joined = [contact.firstName, contact.lastName].filter(Boolean).join(" ").trim();
  return contact.name?.trim() || joined;
}

function contactPhone(contact: ExpoContact) {
  const raw = contact.phoneNumbers?.find((phone) => phone.number?.trim())?.number?.trim() ?? "";
  if (!raw) return "";
  try {
    return normaliseZambianPhone(raw);
  } catch {
    return raw;
  }
}

export const contactService = {
  async pickContact(): Promise<NativeServiceResult<DeviceContact>> {
    if (Platform.OS === "web") {
      return nativeUnavailable("browser-preview", "Phone contacts are available on iOS and Android. Enter the contact manually on web.");
    }

    const Contacts = loadExpoContacts();
    if (!Contacts?.requestPermissionsAsync || !Contacts.presentContactPickerAsync) {
      return nativeUnavailable("missing-native-module", "Phone contacts are not installed in this build yet.");
    }

    const permission = await Contacts.requestPermissionsAsync();
    if (permission.status !== "granted") {
      return nativeUnavailable("permission-denied", "Contact permission was not granted.");
    }

    const contact = await Contacts.presentContactPickerAsync();
    if (!contact) return nativeUnavailable("cancelled", "No contact was selected.");

    const name = contactName(contact);
    const phone = contactPhone(contact);
    if (!name && !phone) {
      return nativeUnavailable("unknown", "That contact does not include a name or phone number.");
    }

    return nativeSuccess({ name, phone });
  },
};
