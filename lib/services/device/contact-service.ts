import { Platform } from "react-native";
import { contactMatchesQuery } from "@/lib/contact-search";
import { normaliseZambianPhone } from "@/lib/auth-flow";
import { nativeSuccess, nativeUnavailable, type NativeServiceResult } from "./native-service-result";

type ExpoContact = {
  name?: string;
  firstName?: string;
  lastName?: string;
  phoneNumbers?: { number?: string }[];
};

type ExpoContactsModule = {
  getPermissionsAsync?: () => Promise<{ status: string }>;
  getContactsAsync?: (options: { fields: string[]; pageSize: number; pageOffset: number }) => Promise<{ data: ExpoContact[]; hasNextPage: boolean }>;
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
     
    // eslint-disable-next-line @typescript-eslint/no-require-imports
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
  if (raw.startsWith("+")) return `+${raw.replace(/\D/g, "")}`;
  if (raw.startsWith("00")) return `+${raw.replace(/\D/g, "").slice(2)}`;
  try {
    return normaliseZambianPhone(raw);
  } catch {
    return raw;
  }
}

export const contactService = {
  async searchContacts(query: string, isCancelled: () => boolean = () => false): Promise<DeviceContact[]> {
    if (Platform.OS === "web" || query.trim().length < 2) return [];
    const Contacts = loadExpoContacts();
    if (!Contacts?.getContactsAsync || !Contacts.getPermissionsAsync) return [];
    // Typing never triggers a permission dialog. The explicit picker can request access.
    if ((await Contacts.getPermissionsAsync()).status !== "granted") return [];
    const matches: DeviceContact[] = [];
    let offset = 0;
    while (!isCancelled()) {
      const page = await Contacts.getContactsAsync({ fields: ["phoneNumbers"], pageSize: 200, pageOffset: offset });
      if (isCancelled()) return [];
      for (const contact of page.data) {
        for (const phone of contact.phoneNumbers ?? []) {
          const candidate = { name: contactName(contact), phone: contactPhone({ phoneNumbers: [phone] }) };
          if (candidate.phone && contactMatchesQuery(candidate, query) && !matches.some((item) => item.phone === candidate.phone && item.name === candidate.name)) matches.push(candidate);
          if (matches.length === 4) return matches;
        }
      }
      if (!page.hasNextPage || !page.data.length) break;
      offset += page.data.length;
    }
    return matches;
  },
  async pickContact(): Promise<NativeServiceResult<DeviceContact>> {
    if (Platform.OS === "web") {
      return nativeUnavailable("browser-preview", "Phone contacts are available on iOS and Android. Enter the contact manually on web.");
    }

    const Contacts = loadExpoContacts();
    if (!Contacts?.presentContactPickerAsync) {
      return nativeUnavailable("missing-native-module", "Phone contacts are not installed in this build yet.");
    }

    if (Platform.OS === "android") {
      const permission = await Contacts.requestPermissionsAsync?.();
      if (permission?.status !== "granted") return nativeUnavailable("permission-denied", "Allow contacts access in Settings, or type the number manually.");
    }

    const contact = await Contacts.presentContactPickerAsync();
    if (!contact) return nativeUnavailable("cancelled", "No contact was selected.");

    const name = contactName(contact);
    const phone = contactPhone(contact);
    if (!phone) {
      return nativeUnavailable("unknown", "That contact has no phone number. Choose another contact or type the number.");
    }

    return nativeSuccess({ name, phone });
  },
};
