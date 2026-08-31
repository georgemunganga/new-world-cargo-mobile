import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const SESSION_KEY = "new-world-cargo.customer-session.v1";

export async function readStoredSession() {
  if (Platform.OS === "web") return typeof localStorage === "undefined" ? null : localStorage.getItem(SESSION_KEY);
  return SecureStore.getItemAsync(SESSION_KEY);
}

export async function writeStoredSession(value: string) {
  if (Platform.OS === "web") {
    if (typeof localStorage !== "undefined") localStorage.setItem(SESSION_KEY, value);
    return;
  }
  await SecureStore.setItemAsync(SESSION_KEY, value);
}

export async function clearStoredSession() {
  if (Platform.OS === "web") {
    if (typeof localStorage !== "undefined") localStorage.removeItem(SESSION_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(SESSION_KEY);
}
