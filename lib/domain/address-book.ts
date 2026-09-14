export type AddressBookKind = "places" | "recipients";

export type AddressBookItem = {
  id: string;
  label: string;
  detail: string;
  city?: string;
  area?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
};
