import { Platform } from "react-native";
import { SESSION_CSRF_TOKEN_KEY, SESSION_TOKEN_KEY, USER_INFO_KEY } from "@/constants/oauth";

export type User = {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  loginMethod: string | null;
  lastSignedIn: Date;
};

export async function getSessionToken(): Promise<string | null> {
  try {
    if (Platform.OS === "web") return null;
    const SecureStore = await import("expo-secure-store");
    return SecureStore.getItemAsync(SESSION_TOKEN_KEY);
  } catch (error) {
    return null;
  }
}

export async function setSessionToken(token: string): Promise<void> {
  try {
    if (Platform.OS === "web") return;
    const SecureStore = await import("expo-secure-store");
    await SecureStore.setItemAsync(SESSION_TOKEN_KEY, token);
  } catch (error) {
    throw error;
  }
}

export async function removeSessionToken(): Promise<void> {
  try {
    if (Platform.OS === "web") return;
    const SecureStore = await import("expo-secure-store");
    await SecureStore.deleteItemAsync(SESSION_TOKEN_KEY);
  } catch (error) {
    return;
  }
}

export async function getSessionCsrfToken(): Promise<string | null> {
  try {
    if (Platform.OS === "web") return null;
    const SecureStore = await import("expo-secure-store");
    return SecureStore.getItemAsync(SESSION_CSRF_TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setSessionCsrfToken(token: string): Promise<void> {
  if (Platform.OS === "web") return;
  const SecureStore = await import("expo-secure-store");
  await SecureStore.setItemAsync(SESSION_CSRF_TOKEN_KEY, token);
}

export async function removeSessionCsrfToken(): Promise<void> {
  try {
    if (Platform.OS === "web") return;
    const SecureStore = await import("expo-secure-store");
    await SecureStore.deleteItemAsync(SESSION_CSRF_TOKEN_KEY);
  } catch {
    return;
  }
}

export async function getUserInfo(): Promise<User | null> {
  try {
    let info: string | null = null;
    if (Platform.OS === "web") {
      info = window.localStorage.getItem(USER_INFO_KEY);
    } else {
      const SecureStore = await import("expo-secure-store");
      info = await SecureStore.getItemAsync(USER_INFO_KEY);
    }

    if (!info) return null;
    const user = JSON.parse(info);
    return user;
  } catch (error) {
    return null;
  }
}

export async function setUserInfo(user: User): Promise<void> {
  try {
    if (Platform.OS === "web") {
      window.localStorage.setItem(USER_INFO_KEY, JSON.stringify(user));
      return;
    }

    const SecureStore = await import("expo-secure-store");
    await SecureStore.setItemAsync(USER_INFO_KEY, JSON.stringify(user));
  } catch (error) {
    return;
  }
}

export async function clearUserInfo(): Promise<void> {
  try {
    if (Platform.OS === "web") {
      window.localStorage.removeItem(USER_INFO_KEY);
      return;
    }

    const SecureStore = await import("expo-secure-store");
    await SecureStore.deleteItemAsync(USER_INFO_KEY);
  } catch (error) {
    return;
  }
}
