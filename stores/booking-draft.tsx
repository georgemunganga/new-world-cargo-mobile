import { createContext, useContext, useMemo, useState, type PropsWithChildren } from "react";
import type { BookingStep, CustomRequestDraft, ImportBookingDraft, IntercityBookingDraft, LocalDeliveryDraft } from "@/types/cargo";
import { mockBookingDraftRecords, type MockBookingDraftRecord } from "@/lib/mock-booking-drafts";

const freshDraft = (): LocalDeliveryDraft => ({ service: "local", step: "route", quantity: 1, handling: "standard", schedule: "as_soon_as_possible", vehicle: "scooter" });
const freshImportDraft = (): ImportBookingDraft => ({ service: "import", quantity: 1 });
const freshIntercityDraft = (): IntercityBookingDraft => ({ service: "intercity", quantity: 1, fulfilment: "collection", schedule: "next_available" });
const freshCustomDraft = (): CustomRequestDraft => ({ service: "custom" });

type BookingDraftContextValue = {
  localDraft: LocalDeliveryDraft;
  updateLocalDraft: (patch: Partial<LocalDeliveryDraft>) => void;
  setBookingStep: (step: BookingStep) => void;
  resetLocalDraft: () => void;
  importDraft: ImportBookingDraft;
  updateImportDraft: (patch: Partial<ImportBookingDraft>) => void;
  resetImportDraft: () => void;
  intercityDraft: IntercityBookingDraft;
  updateIntercityDraft: (patch: Partial<IntercityBookingDraft>) => void;
  resetIntercityDraft: () => void;
  customDraft: CustomRequestDraft;
  updateCustomDraft: (patch: Partial<CustomRequestDraft>) => void;
  resetCustomDraft: () => void;
  savedDrafts: MockBookingDraftRecord[];
  resumeSavedDraft: (id: string) => string | undefined;
  deleteSavedDraft: (id: string) => void;
};

const BookingDraftContext = createContext<BookingDraftContextValue | null>(null);

export function BookingDraftProvider({ children }: PropsWithChildren) {
  const [localDraft, setLocalDraft] = useState<LocalDeliveryDraft>(freshDraft);
  const [importDraft, setImportDraft] = useState<ImportBookingDraft>(freshImportDraft);
  const [intercityDraft, setIntercityDraft] = useState<IntercityBookingDraft>(freshIntercityDraft);
  const [customDraft, setCustomDraft] = useState<CustomRequestDraft>(freshCustomDraft);
  const [savedDrafts, setSavedDrafts] = useState(mockBookingDraftRecords);
  const value = useMemo<BookingDraftContextValue>(() => ({
    localDraft,
    updateLocalDraft: (patch) => setLocalDraft((draft) => ({ ...draft, ...patch })),
    setBookingStep: (step) => setLocalDraft((draft) => ({ ...draft, step })),
    resetLocalDraft: () => setLocalDraft(freshDraft()),
    importDraft,
    updateImportDraft: (patch) => setImportDraft((draft) => ({ ...draft, ...patch })),
    resetImportDraft: () => setImportDraft(freshImportDraft()),
    intercityDraft,
    updateIntercityDraft: (patch) => setIntercityDraft((draft) => ({ ...draft, ...patch })),
    resetIntercityDraft: () => setIntercityDraft(freshIntercityDraft()),
    customDraft,
    updateCustomDraft: (patch) => setCustomDraft((draft) => ({ ...draft, ...patch })),
    resetCustomDraft: () => setCustomDraft(freshCustomDraft()),
    savedDrafts,
    resumeSavedDraft: (id) => {
      const saved = savedDrafts.find((draft) => draft.id === id);
      if (!saved) return undefined;
      if (saved.service === "local") setLocalDraft({ ...freshDraft(), step: "contacts", pickup: { city: "Lusaka", area: "Olympia", detail: "Manda Hill Road", label: "Manda Hill" }, destination: { city: "Lusaka", area: "Kabulonga", detail: "Bishop Road", label: "Kabulonga" }, parcelCategory: "Parcel", parcelDescription: "Small cargo parcel", quantity: 1, vehicle: "scooter" });
      if (saved.service === "import") setImportDraft({ ...freshImportDraft(), method: "air", originCountry: "China", originCity: "Guangzhou", destinationCity: "Lusaka", cargoCategory: "General cargo", quantity: 1 });
      if (saved.service === "intercity") setIntercityDraft({ ...freshIntercityDraft(), originCity: "Lusaka", destinationCity: "Kitwe", cargoCategory: "Parcel", quantity: 1 });
      if (saved.service === "custom") setCustomDraft({ ...freshCustomDraft(), pickup: { city: "Lusaka", area: "Woodlands", detail: "Chindo Road", label: "Woodlands" }, destination: { city: "Ndola", area: "Town Centre", detail: "Broadway", label: "Ndola" } });
      return saved.resumeHref;
    },
    deleteSavedDraft: (id) => setSavedDrafts((drafts) => drafts.filter((draft) => draft.id !== id)),
  }), [localDraft, importDraft, intercityDraft, customDraft, savedDrafts]);
  return <BookingDraftContext.Provider value={value}>{children}</BookingDraftContext.Provider>;
}

export function useBookingDraft() {
  const context = useContext(BookingDraftContext);
  if (!context) throw new Error("useBookingDraft must be used within BookingDraftProvider");
  return context;
}
