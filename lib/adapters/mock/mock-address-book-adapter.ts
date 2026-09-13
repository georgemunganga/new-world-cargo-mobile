import { mockRecipients, mockSavedPlaces } from "@/lib/mock-account-directory";
import type { AddressBookRepository } from "@/lib/repositories/types";

const savedPlaces = [...mockSavedPlaces];
const recipients = [...mockRecipients];

function listFor(kind: "places" | "recipients") {
  return kind === "places" ? savedPlaces : recipients;
}

export const mockAddressBookRepository: AddressBookRepository = {
  async listRecipients() {
    return recipients;
  },
  async listSavedPlaces() {
    return savedPlaces;
  },
  async saveDirectoryItem(kind, item) {
    const list = listFor(kind);
    const next = { id: item.id || `${kind}-${list.length + 1}`, label: item.label, detail: item.detail };
    const index = list.findIndex((entry) => entry.id === next.id);
    if (index >= 0) list[index] = next;
    else list.push(next);
    return next;
  },
  async removeDirectoryItem(kind, id) {
    const list = listFor(kind);
    const index = list.findIndex((entry) => entry.id === id);
    if (index >= 0) list.splice(index, 1);
  },
};
