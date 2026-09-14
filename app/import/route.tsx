import { router } from "expo-router";
import { BookingMapRouteShell } from "@/components/booking/booking-map-route-shell";
import { BookingSection, ChoiceTile } from "@/components/booking/booking-ui";
import { RouteEntryCard } from "@/components/booking/route-entry-card";
import { importSteps } from "@/lib/service-booking";
import { useBookingDraft } from "@/stores/booking-draft";
import type { Address } from "@/types/cargo";

function laneAddress(
  city?: string,
  country?: string,
  branchId?: string,
  latitude?: number,
  longitude?: number,
): Address | undefined {
  if (!city) return undefined;
  return {
    city,
    area: country || city,
    detail: city,
    label: country ? `${city}, ${country}` : city,
    branchId,
    latitude,
    longitude,
  };
}

export default function ImportRouteScreen() {
  const { importDraft, updateImportDraft } = useBookingDraft();
  const ready = Boolean(
    importDraft.method &&
    importDraft.originCountry &&
    importDraft.originCity &&
    importDraft.destinationCity,
  );
  return (
    <BookingMapRouteShell
      service="import"
      activeStep="route"
      serviceLabel="International Imports"
      progressSteps={importSteps}
      title="Plan your international shipment"
      detail="Choose the supported origin and Zambia receiving branch, then select Air or Sea Freight on this same page."
      pickup={laneAddress(
        importDraft.originCity,
        importDraft.originCountry,
        importDraft.originBranchId,
        importDraft.originLatitude,
        importDraft.originLongitude,
      )}
      destination={laneAddress(
        importDraft.destinationCity,
        "Zambia",
        importDraft.destinationBranchId,
        importDraft.destinationLatitude,
        importDraft.destinationLongitude,
      )}
      routeReady={ready}
      continueLabel="Continue to cargo"
      continueDisabled={!ready}
      onContinue={() => router.push("/import/cargo" as never)}
    >
      <RouteEntryCard
        scope="import"
        from={{
          value: importDraft.originCity ?? "",
          detail:
            importDraft.originCountry ??
            "Supplier city, port, airport, or branch",
        }}
        to={{
          value: importDraft.destinationCity ?? "",
          detail: importDraft.destinationBranchId
            ? "Selected receiving branch"
            : "Receiving city or branch",
        }}
        onSuggestionSelect={(target, suggestion) =>
          target === "from"
            ? updateImportDraft({
                originCountry: suggestion.country ?? importDraft.originCountry,
                originCity: suggestion.city,
                originBranchId: suggestion.branchId,
                originLatitude: suggestion.latitude,
                originLongitude: suggestion.longitude,
              })
            : updateImportDraft({
                destinationCity: suggestion.city,
                destinationBranchId: suggestion.branchId,
                destinationLatitude: suggestion.latitude,
                destinationLongitude: suggestion.longitude,
              })
        }
        accessibilityHint="Set your import origin and receiving city"
      />
      <BookingSection label="Shipment type">
        <ChoiceTile
          title="Air Freight"
          detail="Faster for time-sensitive cargo."
          icon="airplane"
          selected={importDraft.method === "air"}
          onPress={() => updateImportDraft({ method: "air" })}
        />
        <ChoiceTile
          title="Sea Freight"
          detail="Best for larger or flexible shipments."
          icon="ferry"
          selected={importDraft.method === "sea"}
          onPress={() => updateImportDraft({ method: "sea" })}
        />
      </BookingSection>
    </BookingMapRouteShell>
  );
}
