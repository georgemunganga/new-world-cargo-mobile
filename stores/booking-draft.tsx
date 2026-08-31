import { createContext, useContext, useMemo, useState, type PropsWithChildren } from "react";
import type { BookingStep, LocalDeliveryDraft } from "@/types/cargo";

const freshDraft = (): LocalDeliveryDraft => ({ service: "local", step: "route", quantity: 1, handling: "standard", schedule: "as_soon_as_possible" });

type BookingDraftContextValue = {
  localDraft: LocalDeliveryDraft;
  updateLocalDraft: (patch: Partial<LocalDeliveryDraft>) => void;
  setBookingStep: (step: BookingStep) => void;
  resetLocalDraft: () => void;
};

const BookingDraftContext = createContext<BookingDraftContextValue | null>(null);

export function BookingDraftProvider({ children }: PropsWithChildren) {
  const [localDraft, setLocalDraft] = useState<LocalDeliveryDraft>(freshDraft);
  const value = useMemo<BookingDraftContextValue>(() => ({
    localDraft,
    updateLocalDraft: (patch) => setLocalDraft((draft) => ({ ...draft, ...patch })),
    setBookingStep: (step) => setLocalDraft((draft) => ({ ...draft, step })),
    resetLocalDraft: () => setLocalDraft(freshDraft()),
  }), [localDraft]);
  return <BookingDraftContext.Provider value={value}>{children}</BookingDraftContext.Provider>;
}

export function useBookingDraft() {
  const context = useContext(BookingDraftContext);
  if (!context) throw new Error("useBookingDraft must be used within BookingDraftProvider");
  return context;
}
