import { createContext, useContext, useMemo, useState, type PropsWithChildren } from "react";
import type { BookingStep, ImportBookingDraft, IntercityBookingDraft, LocalDeliveryDraft } from "@/types/cargo";

const freshDraft = (): LocalDeliveryDraft => ({ service: "local", step: "route", quantity: 1, handling: "standard", schedule: "as_soon_as_possible" });
const freshImportDraft = (): ImportBookingDraft => ({ service: "import", quantity: 1 });
const freshIntercityDraft = (): IntercityBookingDraft => ({ service: "intercity", quantity: 1, fulfilment: "collection", schedule: "next_available" });

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
};

const BookingDraftContext = createContext<BookingDraftContextValue | null>(null);

export function BookingDraftProvider({ children }: PropsWithChildren) {
  const [localDraft, setLocalDraft] = useState<LocalDeliveryDraft>(freshDraft);
  const [importDraft, setImportDraft] = useState<ImportBookingDraft>(freshImportDraft);
  const [intercityDraft, setIntercityDraft] = useState<IntercityBookingDraft>(freshIntercityDraft);
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
  }), [localDraft, importDraft, intercityDraft]);
  return <BookingDraftContext.Provider value={value}>{children}</BookingDraftContext.Provider>;
}

export function useBookingDraft() {
  const context = useContext(BookingDraftContext);
  if (!context) throw new Error("useBookingDraft must be used within BookingDraftProvider");
  return context;
}
