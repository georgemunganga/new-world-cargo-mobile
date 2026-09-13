import { apiClient } from "@/lib/api/client";
import type { AddressBookItem, AddressBookKind } from "@/lib/domain/address-book";
import type { AddressBookRepository } from "@/lib/repositories/types";

function endpointFor(kind: AddressBookKind, id?: string) {
  const base = kind === "places" ? "/api/customer/saved-places" : "/api/customer/recipients";
  return id ? `${base}/${encodeURIComponent(id)}` : base;
}

export const laravelAddressBookRepository: AddressBookRepository = {
  async listRecipients() {
    const response = await apiClient.get<{ data: AddressBookItem[] }>("/api/customer/recipients");
    return response.data;
  },
  async listSavedPlaces() {
    const response = await apiClient.get<{ data: AddressBookItem[] }>("/api/customer/saved-places");
    return response.data;
  },
  async saveDirectoryItem(kind, item) {
    const endpoint = endpointFor(kind, item.id);
    const response = item.id
      ? await apiClient.put<{ data: AddressBookItem }>(endpoint, { label: item.label, detail: item.detail })
      : await apiClient.post<{ data: AddressBookItem }>(endpoint, { label: item.label, detail: item.detail });
    return response.data;
  },
  async removeDirectoryItem(kind, id) {
    await apiClient.delete(endpointFor(kind, id));
  },
};
