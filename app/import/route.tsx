import { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import { BookingMapRouteShell } from "@/components/booking/booking-map-route-shell";
import { BookingSection, ChoiceTile } from "@/components/booking/booking-ui";
import { RouteEntryCard } from "@/components/booking/route-entry-card";
import { importSteps } from "@/lib/service-booking";
import { loadRouteReferenceData, routeSuggestionToAddress } from "@/lib/route-autocomplete";
import { useBookingDraft } from "@/stores/booking-draft";
import type { Address } from "@/types/cargo";
import { locationService } from "@/lib/services/device/location-service";
import { nearestReceivingBranch } from "@/lib/maps/international-route";
import { useAppToast } from "@/components/ui/app-toast";

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
  const [officeMapPoints, setOfficeMapPoints] = useState<Address[]>([]);
  const toast = useAppToast();
  const current = useRef({ importDraft, updateImportDraft, toast });
  current.current = { importDraft, updateImportDraft, toast };
  const manuallySelectedDestination = useRef(false);
  useEffect(() => {
    let active = true;
    void loadRouteReferenceData().then(async (offices) => {
      if (!active) return;
      setOfficeMapPoints(offices.map(routeSuggestionToAddress));
      if (current.current.importDraft.destinationCity || manuallySelectedDestination.current) return;
      const location = await locationService.getCurrentLocation();
      if (!active || manuallySelectedDestination.current || current.current.importDraft.destinationCity) return;
      if (!location.ok) {
        current.current.toast.info("Choose your receiving branch manually. Location is unavailable.");
        return;
      }
      const branch = nearestReceivingBranch(offices.filter((office): office is typeof office & { latitude: number; longitude: number } => Number.isFinite(office.latitude) && Number.isFinite(office.longitude)), location.value);
      if (!branch) return;
      current.current.updateImportDraft({ destinationCity: branch.city, destinationBranchId: branch.branchId, destinationLatitude: branch.latitude, destinationLongitude: branch.longitude });
      current.current.toast.info(`Nearest receiving branch selected: ${branch.label}. You can change it.`);
    }).catch(() => {
      if (active) current.current.toast.info("Could not detect your location. Choose a receiving branch.");
    });
    return () => {
      active = false;
    };
  }, []);
  const ready = Boolean(
    importDraft.method &&
    importDraft.originCountry &&
    importDraft.originCity &&
    importDraft.originBranchId &&
    importDraft.destinationCity &&
    importDraft.destinationBranchId,
  );
  return (
    <BookingMapRouteShell
      service="import"
      activeStep="route"
      serviceLabel="International Imports"
      progressSteps={importSteps}
      title="Plan your international shipment"
      detail="Choose a New WorldCargo origin office and Zambia receiving branch, then select Air or Sea Freight."
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
      overviewPoints={officeMapPoints}
      routeReady={ready}
      continueLabel="Continue to cargo"
      continueDisabled={!ready}
      onContinue={() => router.push("/import/cargo" as never)}
    >
      <RouteEntryCard
        scope="import"
        requireBranch
        from={{
          value: importDraft.originCity ?? "",
          detail:
            importDraft.originCountry ??
            "Select a New WorldCargo origin office",
        }}
        to={{
          value: importDraft.destinationCity ?? "",
          detail: importDraft.destinationBranchId
            ? "Selected receiving branch"
            : "Select a Zambia receiving branch",
        }}
        onSuggestionSelect={(target, suggestion) => {
          if (target === "to") manuallySelectedDestination.current = true;
          return (
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
          );
        }}
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
