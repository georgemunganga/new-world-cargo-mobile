export type StoredCustomer = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
};

export function decodeStoredCustomer(value: string | null): StoredCustomer | null {
  if (!value) return null;
  try {
    const data = JSON.parse(value) as Partial<StoredCustomer>;
    if (typeof data.id !== "string" || typeof data.name !== "string" || typeof data.phone !== "string" || typeof data.city !== "string") return null;
    if (!data.id.trim() || !data.name.trim() || !data.phone.trim() || !data.city.trim()) return null;
    return { id: data.id, name: data.name, phone: data.phone, city: data.city, ...(typeof data.email === "string" && data.email.trim() ? { email: data.email } : {}) };
  } catch {
    return null;
  }
}

export function authEntryPath(customer: StoredCustomer | null) {
  return customer ? "/(tabs)" : "/auth/welcome";
}
