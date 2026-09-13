import { mobileEnv } from "@/lib/config/env";
import { getSessionToken } from "@/lib/_core/auth";
import { MobileApiError, apiCodeFromStatus, type FieldErrors } from "./errors";

export type ApiClientOptions = {
  baseUrl?: string;
  timeoutMs?: number;
  getAuthToken?: () => Promise<string | null>;
};

export type ApiRequestOptions = RequestInit & {
  auth?: boolean;
  timeoutMs?: number;
};

const DEFAULT_TIMEOUT_MS = 15000;

function joinUrl(baseUrl: string, endpoint: string) {
  if (!baseUrl) return endpoint;
  const cleanBase = baseUrl.replace(/\/$/, "");
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${cleanBase}${cleanEndpoint}`;
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

  async function request<T>(endpoint: string, requestOptions: ApiRequestOptions = {}): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), requestOptions.timeoutMs ?? timeoutMs);
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...(!(requestOptions.body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
      ...((requestOptions.headers as Record<string, string>) || {}),
    };

    if (requestOptions.auth !== false) {
      const token = await getAuthTokenValue();
      if (token) headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(joinUrl(baseUrl, endpoint), {
        ...requestOptions,
        headers,
        signal: requestOptions.signal ?? controller.signal,
      });

      if (!response.ok) {
        const details = await parseErrorResponse(response);
        throw new MobileApiError(apiCodeFromStatus(response.status), details.message || "Request failed.", {
          status: response.status,
          fieldErrors: details.fieldErrors,
          requestId: details.requestId,
          retryable: details.retryable,
        });
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
    post: <T>(endpoint: string, body?: unknown, options?: ApiRequestOptions) => request<T>(endpoint, { ...options, method: "POST", body: body instanceof FormData ? body : JSON.stringify(body ?? {}) }),
    put: <T>(endpoint: string, body?: unknown, options?: ApiRequestOptions) => request<T>(endpoint, { ...options, method: "PUT", body: body instanceof FormData ? body : JSON.stringify(body ?? {}) }),
    patch: <T>(endpoint: string, body?: unknown, options?: ApiRequestOptions) => request<T>(endpoint, { ...options, method: "PATCH", body: body instanceof FormData ? body : JSON.stringify(body ?? {}) }),
    delete: <T>(endpoint: string, options?: ApiRequestOptions) => request<T>(endpoint, { ...options, method: "DELETE" }),
  };
}

export const apiClient = createApiClient();
