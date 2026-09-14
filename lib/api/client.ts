import { mobileEnv } from "@/lib/config/env";
import { getSessionCsrfToken, getSessionToken } from "@/lib/_core/auth";
import { Platform } from "react-native";
import { MobileApiError, apiCodeFromServer, apiCodeFromStatus, type FieldErrors } from "./errors";
import { notifySessionExpired } from "./session-events";

export type ApiClientOptions = {
  baseUrl?: string;
  timeoutMs?: number;
  getAuthToken?: () => Promise<string | null>;
  getCsrfToken?: () => Promise<string | null>;
  mobileClient?: boolean;
};

export type ApiRequestOptions = RequestInit & {
  auth?: boolean;
  timeoutMs?: number;
};

const DEFAULT_TIMEOUT_MS = 15000;
const CSRF_COOKIE_NAME = "nwc_csrf";
const CSRF_HEADER_NAME = "X-CSRF-Token";

function joinUrl(baseUrl: string, endpoint: string) {
  if (/^https?:\/\//i.test(endpoint)) return endpoint;
  if (!baseUrl) return endpoint;
  const cleanBase = baseUrl.replace(/\/$/, "");
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${cleanBase}${cleanEndpoint}`;
}

function readCookie(name: string) {
  if (typeof document === "undefined") return "";
  const cookies = document.cookie ? document.cookie.split(";") : [];
  const prefix = `${name}=`;
  const match = cookies.map((cookie) => cookie.trim()).find((cookie) => cookie.startsWith(prefix));
  return match ? decodeURIComponent(match.slice(prefix.length)) : "";
}

function isUnsafeMethod(method?: string) {
  const value = (method ?? "GET").toUpperCase();
  return value !== "GET" && value !== "HEAD" && value !== "OPTIONS";
}

function isRawRequestBody(body: unknown): body is BodyInit {
  return (typeof FormData !== "undefined" && body instanceof FormData)
    || (typeof Blob !== "undefined" && body instanceof Blob)
    || (typeof ArrayBuffer !== "undefined" && body instanceof ArrayBuffer)
    || typeof body === "string";
}

function serializeRequestBody(body: unknown): BodyInit {
  return isRawRequestBody(body) ? body : JSON.stringify(body ?? {});
}

async function parseErrorResponse(response: Response) {
  const requestId = response.headers.get("x-request-id") ?? response.headers.get("x-correlation-id") ?? undefined;
  const text = await response.text();
  if (!text) return { message: response.statusText, requestId };

  try {
    const json = JSON.parse(text) as {
      message?: string;
      error?: string | { message?: string; code?: string; fieldErrors?: FieldErrors; retryable?: boolean };
      errors?: FieldErrors;
      requestId?: string;
    };
    const nested = typeof json.error === "object" ? json.error : undefined;
    return {
      message: nested?.message ?? json.message ?? (typeof json.error === "string" ? json.error : response.statusText),
      code: nested?.code,
      fieldErrors: nested?.fieldErrors ?? json.errors,
      requestId: nested ? json.requestId ?? requestId : json.requestId ?? requestId,
      retryable: nested?.retryable,
    };
  } catch {
    return { message: text, requestId };
  }
}

export function createApiClient(options: ApiClientOptions = {}) {
  const baseUrl = options.baseUrl ?? mobileEnv.apiBaseUrl;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const getAuthTokenValue = options.getAuthToken ?? getSessionToken;
  const getCsrfTokenValue = options.getCsrfToken ?? getSessionCsrfToken;
  const mobileClient = options.mobileClient ?? Platform.OS !== "web";

  async function request<T>(endpoint: string, requestOptions: ApiRequestOptions = {}): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), requestOptions.timeoutMs ?? timeoutMs);
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...(mobileClient ? { "X-NWC-Mobile-Client": "1" } : {}),
      ...(!isRawRequestBody(requestOptions.body) ? { "Content-Type": "application/json" } : {}),
      ...((requestOptions.headers as Record<string, string>) || {}),
    };

    if (requestOptions.auth !== false) {
      const token = await getAuthTokenValue();
      if (token) headers.Authorization = `Bearer ${token}`;
    }

    if (isUnsafeMethod(requestOptions.method) && !headers[CSRF_HEADER_NAME]) {
      const csrf = mobileClient ? await getCsrfTokenValue() : readCookie(CSRF_COOKIE_NAME);
      if (csrf) headers[CSRF_HEADER_NAME] = csrf;
    }

    try {
      const response = await fetch(joinUrl(baseUrl, endpoint), {
        ...requestOptions,
        headers,
        credentials: requestOptions.credentials ?? "include",
        signal: requestOptions.signal ?? controller.signal,
      });

      if (!response.ok) {
        const details = await parseErrorResponse(response);
        const error = new MobileApiError(apiCodeFromServer(details.code) ?? apiCodeFromStatus(response.status), details.message || "Request failed.", {
          status: response.status,
          fieldErrors: details.fieldErrors,
          requestId: details.requestId,
          retryable: details.retryable,
        });
        if (error.code === "UNAUTHENTICATED" && requestOptions.auth !== false) notifySessionExpired(error);
        throw error;
      }

      if (response.status === 204) return undefined as T;
      const contentType = response.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) return (await response.json()) as T;
      return (await response.text()) as T;
    } catch (error) {
      if (error instanceof MobileApiError) throw error;
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new MobileApiError("TIMEOUT", "The request took too long. Please try again.", { retryable: true });
      }
      throw new MobileApiError("NETWORK_UNAVAILABLE", "We could not reach New WorldCargo. Check your connection and try again.", { retryable: true });
    } finally {
      clearTimeout(timeout);
    }
  }

  return {
    get: <T>(endpoint: string, options?: ApiRequestOptions) => request<T>(endpoint, { ...options, method: "GET" }),
    post: <T>(endpoint: string, body?: unknown, options?: ApiRequestOptions) => request<T>(endpoint, { ...options, method: "POST", body: serializeRequestBody(body) }),
    put: <T>(endpoint: string, body?: unknown, options?: ApiRequestOptions) => request<T>(endpoint, { ...options, method: "PUT", body: serializeRequestBody(body) }),
    patch: <T>(endpoint: string, body?: unknown, options?: ApiRequestOptions) => request<T>(endpoint, { ...options, method: "PATCH", body: serializeRequestBody(body) }),
    delete: <T>(endpoint: string, options?: ApiRequestOptions) => request<T>(endpoint, { ...options, method: "DELETE" }),
  };
}

export const apiClient = createApiClient();
