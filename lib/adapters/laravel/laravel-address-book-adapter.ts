import { apiClient } from "@/lib/api/client";
import type { AddressBookItem, AddressBookKind } from "@/lib/domain/address-book";
import type { AddressBookRepository } from "@/lib/repositories/types";
import { missingPortalContract } from "./portal-contract-gap";

function endpointFor(kind: AddressBookKind, id?: string) {
  const base = kind === "places" ? "/api/v1/addresses" : "/api/v1/recipients";
  return id ? `${base}/${encodeURIComponent(id)}` : base;
}

type LaravelRecipientResponse = { id: string | number; name?: string; address?: string; phone?: string; countryCode?: string | null };

function mapRecipient(raw: LaravelRecipientResponse): AddressBookItem {
  return {
    id: String(raw.id),
    label: raw.name ?? "Recipient",
    detail: [raw.phone, raw.address].filter(Boolean).join(" · ") || "Recipient details",
  };
}

function recipientPayload(item: Omit<AddressBookItem, "id"> & { id?: string }) {
  const [phone = "", address = item.detail] = item.detail.split(" · ", 2);
  return {
    name: item.label,
    phone,
    address,
  };
}

export const laravelAddressBookRepository: AddressBookRepository = {
  async listRecipients() {
    const response = await apiClient.get<{ data: LaravelRecipientResponse[] }>("/api/v1/recipients");
    return response.data.map(mapRecipient);
  },
  async listSavedPlaces() {
    missingPortalContract("Saved places list compatible with the mobile simple address-book UI");
  },
  async saveDirectoryItem(kind, item) {
    if (kind === "places") missingPortalContract("Saved places create/update compatible with the mobile simple address-book UI");
    const endpoint = endpointFor(kind, item.id);
    const response = item.id
      ? await apiClient.patch<{ data: LaravelRecipientResponse }>(endpoint, recipientPayload(item))
      : await apiClient.post<{ data: LaravelRecipientResponse }>(endpoint, recipientPayload(item));
    return mapRecipient(response.data);
  },
  async removeDirectoryItem(kind, id) {
    if (kind === "places") missingPortalContract("Saved places delete compatible with the mobile simple address-book UI");
    await apiClient.delete(endpointFor(kind, id));
  },
};
