import { useCallback, useEffect, useState } from "react";
import { customerSafeMessageFor } from "@/lib/api/errors";
import type { AddressBookItem, AddressBookKind } from "@/lib/domain/address-book";
import { repositories } from "@/lib/repositories";
import { readStoredAddressBook, writeStoredAddressBook } from "@/lib/storage/address-book-storage";

export function useAddressBook() {
  const [recipients, setRecipients] = useState<AddressBookItem[]>([]);
  const [savedPlaces, setSavedPlaces] = useState<AddressBookItem[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "empty" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isStale, setIsStale] = useState(false);

  const refresh = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");
    setIsStale(false);
    try {
      const [nextRecipients, nextSavedPlaces] = await Promise.all([
        repositories.addressBook.listRecipients(),
        repositories.addressBook.listSavedPlaces(),
      ]);
      await writeStoredAddressBook({ recipients: nextRecipients, savedPlaces: nextSavedPlaces });
      setRecipients(nextRecipients);
      setSavedPlaces(nextSavedPlaces);
      setStatus(nextRecipients.length || nextSavedPlaces.length ? "success" : "empty");
    } catch (error) {
      const stored = await readStoredAddressBook();
      if (stored && (stored.recipients.length || stored.savedPlaces.length)) {
        setRecipients(stored.recipients);
        setSavedPlaces(stored.savedPlaces);
        setIsStale(true);
        setErrorMessage("Showing your last saved recipients and places. Try again when your connection is back.");
        setStatus("success");
        return;
      }
      setErrorMessage(customerSafeMessageFor(error));
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const saveDirectoryItem = useCallback(async (kind: AddressBookKind, item: Omit<AddressBookItem, "id"> & { id?: string }) => {
    const saved = await repositories.addressBook.saveDirectoryItem(kind, item);
    const update = (current: AddressBookItem[]) => current.some((entry) => entry.id === saved.id) ? current.map((entry) => entry.id === saved.id ? saved : entry) : [...current, saved];
    if (kind === "places") {
      const nextSavedPlaces = update(savedPlaces);
      setSavedPlaces(nextSavedPlaces);
      await writeStoredAddressBook({ recipients, savedPlaces: nextSavedPlaces });
    } else {
      const nextRecipients = update(recipients);
      setRecipients(nextRecipients);
      await writeStoredAddressBook({ recipients: nextRecipients, savedPlaces });
    }
    setStatus("success");
    setIsStale(false);
    return saved;
  }, [recipients, savedPlaces]);

  const removeDirectoryItem = useCallback(async (kind: AddressBookKind, id: string) => {
    await repositories.addressBook.removeDirectoryItem(kind, id);
    if (kind === "places") {
      const nextSavedPlaces = savedPlaces.filter((item) => item.id !== id);
      setSavedPlaces(nextSavedPlaces);
      await writeStoredAddressBook({ recipients, savedPlaces: nextSavedPlaces });
    } else {
      const nextRecipients = recipients.filter((item) => item.id !== id);
      setRecipients(nextRecipients);
      await writeStoredAddressBook({ recipients: nextRecipients, savedPlaces });
    }
    setIsStale(false);
  }, [recipients, savedPlaces]);

  return { recipients, savedPlaces, status, errorMessage, isStale, refresh, saveDirectoryItem, removeDirectoryItem };
}
