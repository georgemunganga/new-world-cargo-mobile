import { useQueryClient } from "@tanstack/react-query";
import { customerQueries } from "@/lib/data/customer-queries";
import { useCustomerQuery } from "@/lib/data/use-customer-query";
import { repositories } from "@/lib/repositories";
import type {
  AddressBookItem,
  AddressBookKind,
} from "@/lib/domain/address-book";
export function useAddressBook() {
  const client = useQueryClient();
  const places = useCustomerQuery(customerQueries.places);
  const people = useCustomerQuery(customerQueries.recipients);
  const savedPlaces = places.data ?? [],
    recipients = people.data ?? [];
  const refresh = async () => {
    await Promise.all([places.refetch(), people.refetch()]);
  };
  const saveDirectoryItem = async (
    kind: AddressBookKind,
    item: Omit<AddressBookItem, "id"> & { id?: string },
  ) => {
    const saved = await repositories.addressBook.saveDirectoryItem(kind, item);
    const key =
      kind === "places"
        ? customerQueries.places.queryKey
        : customerQueries.recipients.queryKey;
    await client.cancelQueries({ queryKey: key });
    client.setQueryData<AddressBookItem[]>(key, (current) => [
      ...(current ?? []).filter((entry) => entry.id !== saved.id),
      saved,
    ]);
    return saved;
  };
  const removeDirectoryItem = async (kind: AddressBookKind, id: string) => {
    await repositories.addressBook.removeDirectoryItem(kind, id);
    const key =
      kind === "places"
        ? customerQueries.places.queryKey
        : customerQueries.recipients.queryKey;
    await client.cancelQueries({ queryKey: key });
    client.setQueryData<AddressBookItem[]>(key, (current) =>
      (current ?? []).filter((entry) => entry.id !== id),
    );
  };
  const status =
    places.status === "loading" || people.status === "loading"
      ? "loading"
      : places.status === "error" || people.status === "error"
        ? "error"
        : savedPlaces.length || recipients.length
          ? "success"
          : "empty";
  return {
    placesState: {status: places.status, errorMessage: places.errorMessage, refresh: places.refresh},
    recipientsState: {status: people.status, errorMessage: people.errorMessage, refresh: people.refresh},
    savedPlaces,
    recipients,
    status,
    errorMessage: places.errorMessage || people.errorMessage,
    isStale: places.isStale || people.isStale,
    refresh,
    saveDirectoryItem,
    removeDirectoryItem,
  };
}
