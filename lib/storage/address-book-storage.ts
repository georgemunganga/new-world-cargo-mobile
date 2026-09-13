import type { AddressBookItem } from "@/lib/domain/address-book";
import { readJsonStorage, writeJsonStorage } from "./json-storage";
import { storageKeys } from "./storage-keys";

export type StoredAddressBook = {
  recipients: AddressBookItem[];
  savedPlaces: AddressBookItem[];
};

export async function readStoredAddressBook() {
  return readJsonStorage<StoredAddressBook>(storageKeys.addressBookCache);
}

export function writeStoredAddressBook(value: StoredAddressBook) {
  return writeJsonStorage(storageKeys.addressBookCache, value);
}
