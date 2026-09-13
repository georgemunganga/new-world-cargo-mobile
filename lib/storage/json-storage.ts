import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

export type JsonStorageArea = "secure" | "local";

function canUseLocalStorage() {
  return Platform.OS === "web" && typeof localStorage !== "undefined";
}

export async function readJsonStorage<T>(key: string, area: JsonStorageArea = "local"): Promise<T | null> {
  const value = area === "secure" && Platform.OS !== "web"
    ? await SecureStore.getItemAsync(key)
    : canUseLocalStorage()
      ? localStorage.getItem(key)
      : await AsyncStorage.getItem(key);

  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export async function writeJsonStorage<T>(key: string, value: T, area: JsonStorageArea = "local") {
  const encoded = JSON.stringify(value);
  if (area === "secure" && Platform.OS !== "web") {
    await SecureStore.setItemAsync(key, encoded);
    return;
  }
  if (canUseLocalStorage()) localStorage.setItem(key, encoded);
  else await AsyncStorage.setItem(key, encoded);
}

export async function removeJsonStorage(key: string, area: JsonStorageArea = "local") {
  if (area === "secure" && Platform.OS !== "web") {
    await SecureStore.deleteItemAsync(key);
    return;
  }
  if (canUseLocalStorage()) localStorage.removeItem(key);
  else await AsyncStorage.removeItem(key);
}
