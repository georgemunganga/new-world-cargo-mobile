import { apiClient } from "@/lib/api/client";
import type { AddressBookItem, AddressBookKind } from "@/lib/domain/address-book";
import type { AddressBookRepository } from "@/lib/repositories/types";

function endpointFor(kind: AddressBookKind, id?: string) {
  const base = kind === "places" ? "/api/v1/saved-places" : "/api/v1/recipients";
  return id ? `${base}/${encodeURIComponent(id)}` : base;
}

type LaravelRecipientResponse = { id: string | number; name?: string; address?: string; phone?: string; countryCode?: string | null };
type LaravelSavedPlaceResponse = { id: string | number; label?: string; detail?: string; address?: string; city?: string | null; area?: string | null; country?: string | null; lat?: string | number | null; lng?: string | number | null };

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

function mapSavedPlace(raw: LaravelSavedPlaceResponse): AddressBookItem {
  return {
    id: String(raw.id),
    label: raw.label ?? "Saved place",
    detail: raw.detail ?? raw.address ?? "Saved location",
    ...(raw.city ? { city: raw.city } : {}),
    ...(raw.area ? { area: raw.area } : {}),
    ...(raw.country ? { country: raw.country } : {}),
    ...(raw.lat != null && Number.isFinite(Number(raw.lat)) ? { latitude: Number(raw.lat) } : {}),
    ...(raw.lng != null && Number.isFinite(Number(raw.lng)) ? { longitude: Number(raw.lng) } : {}),
  };
}

export const laravelAddressBookRepository: AddressBookRepository = {
  async listRecipients() {
    const response = await apiClient.get<{ data: LaravelRecipientResponse[] }>("/api/v1/recipients");
    return response.data.map(mapRecipient);
  },
  async listSavedPlaces() {
    const response = await apiClient.get<{ data: LaravelSavedPlaceResponse[] }>("/api/v1/saved-places");
    return response.data.map(mapSavedPlace);
  },
  async saveDirectoryItem(kind, item) {
    const endpoint = endpointFor(kind, item.id);
    if (kind === "places") {
      const payload = { label: item.label, detail: item.detail, city: item.city, area: item.area, country: item.country, latitude: item.latitude, longitude: item.longitude };
      const response = item.id ? await apiClient.patch<{ data: LaravelSavedPlaceResponse }>(endpoint, payload) : await apiClient.post<{ data: LaravelSavedPlaceResponse }>(endpoint, payload);
      return mapSavedPlace(response.data);
    }
    const response = item.id ? await apiClient.patch<{ data: LaravelRecipientResponse }>(endpoint, recipientPayload(item)) : await apiClient.post<{ data: LaravelRecipientResponse }>(endpoint, recipientPayload(item));
    return mapRecipient(response.data);
  },
  async removeDirectoryItem(kind, id) {
    await apiClient.delete(endpointFor(kind, id));
  },
};
