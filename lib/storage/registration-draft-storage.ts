import { readJsonStorage, removeJsonStorage, writeJsonStorage } from "./json-storage";
import { storageKeys } from "./storage-keys";

export type RegistrationDraft = {
  name: string;
  email: string;
  phone: string;
  city: string;
};

export function readRegistrationDraft() {
  return readJsonStorage<RegistrationDraft>(storageKeys.registrationDraft, "secure");
}

export function writeRegistrationDraft(draft: RegistrationDraft) {
  return writeJsonStorage(storageKeys.registrationDraft, draft, "secure");
}

export function clearRegistrationDraft() {
  return removeJsonStorage(storageKeys.registrationDraft, "secure");
}
