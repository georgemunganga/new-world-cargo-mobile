import { apiClient } from "@/lib/api/client";
import { featureFlags } from "@/lib/config/feature-flags";
import type { BookingService } from "@/lib/domain/booking";
import type { Address, BookingCargoItem, BookingQuote, LocalDeliveryVehicle } from "@/types/cargo";

export type BookingQuotePoint = {
  city?: string;
  area?: string;
  branchId?: string;
  latitude?: number;
  longitude?: number;
};

export type BookingQuoteRequest = {
  service: BookingService;
  bookingType: "local_delivery" | "city_to_city" | "international_import" | "custom_request";
  pickup?: BookingQuotePoint;
  destination?: BookingQuotePoint;
  receivingHub?: BookingQuotePoint;
  distanceKm?: number;
  vehicleType?: LocalDeliveryVehicle;
  transportMode?: string;
  fulfilment?: string;
  onwardDelivery?: "collection" | "local" | "intercity";
  onwardVehicleType?: LocalDeliveryVehicle;
  schedule?: string;
  scheduledAt?: string;
  cargo: {
    items: Array<{ name: string; quantity: number; weight?: number; amount?: number }>;
    totalWeight?: number;
    declaredValue?: number;
    fragile: boolean;
    packageType: "standard" | "container";
  };
};

type LaravelQuoteResponse = {
  data?: Partial<BookingQuote> & {
    total?: number | string;
    amount?: number | string;
    formattedTotal?: string;
    formatted_total?: string;
    distanceKm?: number | string;
    distance_km?: number | string;
    estimatedDurationMinutes?: number | string;
    estimated_duration_minutes?: number | string;
    expiresAt?: string;
    expires_at?: string;
    quotePayload?: Record<string, unknown>;
    quote_payload?: Record<string, unknown>;
    calc_payload?: Record<string, unknown>;
    quoteSignature?: string;
    quote_signature?: string;
    calc_sig?: string;
  };
};

const bookingTypes: Record<BookingService, BookingQuoteRequest["bookingType"]> = {
  local: "local_delivery",
  intercity: "city_to_city",
  import: "international_import",
  custom: "custom_request",
};

const localVehicleAdjustments: Record<LocalDeliveryVehicle, number> = {
  scooter: 0,
  small_van: 28,
  cargo_van: 62,
};

function numeric(value: unknown) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function formatKwacha(amount: number, currency = "ZMW") {
  return currency === "ZMW" ? `K ${amount.toFixed(0)}` : `${currency} ${amount.toFixed(2)}`;
}

function pointFromAddress(address?: Address): BookingQuotePoint | undefined {
  if (!address) return undefined;
  return {
    city: address.city,
    area: address.area,
    branchId: address.branchId,
    latitude: address.latitude,
    longitude: address.longitude,
  };
}

function pointFromCity(city?: string, branchId?: string, latitude?: number, longitude?: number): BookingQuotePoint | undefined {
  if (!city && !branchId) return undefined;
  return { city, area: city, branchId, latitude, longitude };
}

function distanceBetween(pickup?: BookingQuotePoint, destination?: BookingQuotePoint) {
  if (pickup?.latitude == null || pickup.longitude == null || destination?.latitude == null || destination.longitude == null) return undefined;
  const earthKm = 6371;
  const toRad = (degrees: number) => degrees * Math.PI / 180;
  const deltaLat = toRad(destination.latitude - pickup.latitude);
  const deltaLon = toRad(destination.longitude - pickup.longitude);
  const startLat = toRad(pickup.latitude);
  const endLat = toRad(destination.latitude);
  const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(startLat) * Math.cos(endLat) * Math.sin(deltaLon / 2) ** 2;
  return Math.round(earthKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
}

function cargoFrom(items?: BookingCargoItem[], fragile = false): BookingQuoteRequest["cargo"] {
  const rows = (items ?? []).filter((item) => item.name.trim()).map((item) => ({
    name: item.name.trim(),
    quantity: item.quantity || 1,
    ...(item.weight ? { weight: item.weight } : {}),
    ...(item.amount ? { amount: item.amount } : {}),
  }));
  const totalWeight = rows.reduce((sum, item) => sum + (item.weight ?? 0) * item.quantity, 0);
  const declaredValue = rows.reduce((sum, item) => sum + (item.amount ?? 0) * item.quantity, 0);
  return {
    items: rows,
    ...(totalWeight ? { totalWeight } : {}),
    ...(declaredValue ? { declaredValue } : {}),
    fragile,
    packageType: "standard",
  };
}

export function bookingQuoteRequestFromDraft(service: BookingService, draft: unknown): BookingQuoteRequest {
  const raw = (draft && typeof draft === "object" ? draft : {}) as Record<string, any>;
  const pickup = service === "local" || service === "custom"
    ? pointFromAddress(raw.pickup)
    : service === "import"
      ? pointFromCity(raw.originCity, raw.originBranchId, raw.originLatitude, raw.originLongitude)
      : pointFromCity(raw.originCity, raw.originBranchId, raw.originLatitude, raw.originLongitude);
  const destination = service === "local" || service === "custom"
    ? pointFromAddress(raw.destination)
    : service === "import"
      ? pointFromCity(raw.destinationCity, raw.destinationBranchId, raw.destinationLatitude, raw.destinationLongitude)
      : pointFromCity(raw.destinationCity, raw.destinationBranchId, raw.destinationLatitude, raw.destinationLongitude);
  const receivingHub = service === "import"
    ? pointFromCity(
        raw.receivingHubCity ?? raw.destinationCity,
        raw.receivingHubBranchId ?? raw.destinationBranchId,
        raw.receivingHubLatitude ?? raw.destinationLatitude,
        raw.receivingHubLongitude ?? raw.destinationLongitude,
      )
    : undefined;
  const cargo = cargoFrom(raw.cargoItems, raw.handling === "fragile");
  cargo.packageType = raw.packageType === "container" ? "container" : "standard";
  return {
    service,
    bookingType: bookingTypes[service],
    pickup,
    destination,
    ...(receivingHub ? { receivingHub } : {}),
    distanceKm: distanceBetween(pickup, destination),
    vehicleType: raw.vehicle,
    transportMode: raw.method,
    fulfilment: raw.fulfilment,
    ...(service === "import" ? { onwardDelivery: raw.onwardDelivery ?? "collection" } : {}),
    ...(service === "import" && raw.onwardVehicle ? { onwardVehicleType: raw.onwardVehicle } : {}),
    schedule: raw.schedule,
    ...(raw.schedule === "scheduled" && raw.scheduledAt ? { scheduledAt: raw.scheduledAt } : {}),
    cargo,
  };
}

function normalizeQuote(raw: LaravelQuoteResponse["data"], request: BookingQuoteRequest): BookingQuote {
  const total = numeric(raw?.total ?? raw?.amount ?? raw?.quotePayload?.total ?? raw?.quote_payload?.total ?? raw?.calc_payload?.total) ?? 0;
  const currency = raw?.currency ?? String(raw?.quotePayload?.currency ?? raw?.quote_payload?.currency ?? raw?.calc_payload?.currency ?? "ZMW");
  const distanceKm = numeric(raw?.distanceKm ?? raw?.distance_km ?? raw?.quotePayload?.distanceKm ?? raw?.quote_payload?.distanceKm ?? raw?.calc_payload?.distance_km) ?? request.distanceKm;
  const estimatedDurationMinutes = numeric(raw?.estimatedDurationMinutes ?? raw?.estimated_duration_minutes ?? raw?.calc_payload?.estimated_duration_minutes);
  const quotePayload = raw?.quotePayload ?? raw?.quote_payload ?? raw?.calc_payload;
  return {
    source: raw?.source === "fallback" ? "fallback" : "server",
    currency,
    total,
    formattedTotal: raw?.formattedTotal ?? raw?.formatted_total ?? formatKwacha(total, currency),
    distanceKm,
    estimatedDurationMinutes,
    expiresAt: raw?.expiresAt ?? raw?.expires_at ?? String(quotePayload?.expires_at ?? ""),
    quotePayload,
    quoteSignature: raw?.quoteSignature ?? raw?.quote_signature ?? raw?.calc_sig,
    breakdown: raw?.breakdown,
  };
}

export function fallbackBookingQuote(request: BookingQuoteRequest): BookingQuote {
  const distanceKm = request.distanceKm ?? 0;
  const vehicle = request.vehicleType ?? "scooter";
  const base = Math.max(55, Math.round(42 + distanceKm * 6));
  const total = request.service === "local" ? base + localVehicleAdjustments[vehicle] : 0;
  return {
    source: "fallback",
    currency: "ZMW",
    total,
    formattedTotal: total ? formatKwacha(total) : "Quote pending",
    distanceKm: request.distanceKm,
    estimatedDurationMinutes: request.distanceKm ? Math.max(15, Math.round(request.distanceKm * 4)) : undefined,
    breakdown: { note: "Development fallback. Final production pricing must come from Laravel." },
  };
}

export async function estimateBookingQuote(service: BookingService, draft: unknown): Promise<BookingQuote | null> {
  const request = bookingQuoteRequestFromDraft(service, draft);
  if (!request.pickup || !request.destination) return null;
  if (featureFlags.useLaravelBookings) {
    const response = await apiClient.post<LaravelQuoteResponse>("/api/v1/bookings/quote", request);
    return normalizeQuote(response.data ?? response as LaravelQuoteResponse["data"], request);
  }
  return fallbackBookingQuote(request);
}
