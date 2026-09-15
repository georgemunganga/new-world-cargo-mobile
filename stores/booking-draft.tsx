import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import type { BookingStep, CustomRequestDraft, ImportBookingDraft, IntercityBookingDraft, LocalDeliveryDraft } from "@/types/cargo";
import { type MockBookingDraftRecord } from "@/lib/mock-booking-drafts";
import { repositories } from "@/lib/repositories";
import { readStoredDraftSummaries, writeStoredDraftSummaries } from "@/lib/storage/draft-storage";
import { useCustomerAuth } from "@/stores/customer-auth";

const freshDraft = (): LocalDeliveryDraft => ({ service: "local", step: "route", quantity: 1, handling: "standard", schedule: "as_soon_as_possible", vehicle: "scooter" });
const freshImportDraft = (): ImportBookingDraft => ({ service: "import", quantity: 1 });
const freshIntercityDraft = (): IntercityBookingDraft => ({ service: "intercity", quantity: 1, fulfilment: "collection", schedule: "next_available" });
const freshCustomDraft = (): CustomRequestDraft => ({ service: "custom" });

function objectValue(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? value as Record<string, unknown> : null;
}

function draftFromPayload<T>(payload: unknown): Partial<T> | null {
  const record = objectValue(payload);
  const draft = objectValue(record?.draft);
  return draft ? draft as Partial<T> : null;
}

function progressParts(progressLabel: string) {
  const [stepLabel, progress] = progressLabel.split(" · ");
  return { stepLabel: stepLabel || "Draft in progress", progress: progress || "Saved" };
}

function resumeHrefFor(service: MockBookingDraftRecord["service"], draft: Record<string, unknown> | null) {
  if (service === "local") {
    if (!draft?.pickup || !draft?.destination) return "/local-delivery/route";
    if (!draft?.cargoItems && !draft?.parcelDescription && !draft?.cargoDescription) return "/local-delivery/parcel";
    if (!draft?.sender || !draft?.receiver) return "/local-delivery/contacts";
    return "/local-delivery/review";
  }
  if (service === "import") {
    if (!draft?.originCity || !draft?.destinationCity) return "/import/route";
    if (!draft?.cargoItems && !draft?.cargoDescription && !draft?.cargoCategory) return "/import/cargo";
    if (!draft?.consignee) return "/import/consignee";
    return "/import/review";
  }
  if (service === "intercity") {
    if (!draft?.originCity || !draft?.destinationCity) return "/intercity/route";
    if (!draft?.cargoItems && !draft?.cargoDescription && !draft?.cargoCategory) return "/intercity/cargo";
    if (!draft?.sender || !draft?.receiver) return "/intercity/contacts";
    return "/intercity/review";
  }
  if (!draft?.pickup || !draft?.destination) return "/custom/route";
  if (!draft?.cargoItems && !draft?.cargoDescription && !draft?.requestType) return "/custom/details";
  return "/custom/review";
}

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
  const { customer, isRestoring } = useCustomerAuth();
  const [localDraft, setLocalDraft] = useState<LocalDeliveryDraft>(freshDraft);
  const [importDraft, setImportDraft] = useState<ImportBookingDraft>(freshImportDraft);
  const [intercityDraft, setIntercityDraft] = useState<IntercityBookingDraft>(freshIntercityDraft);
  useEffect(() => {
    if (isRestoring || !customer) return;
    const contact = { name: customer.name ?? "", phone: customer.phone ?? "" };
    setIntercityDraft((draft) => draft.sender === undefined ? { ...draft, sender: contact } : draft);
    setImportDraft((draft) => draft.consignee === undefined ? { ...draft, consignee: contact } : draft);
  }, [customer, isRestoring, intercityDraft.sender, importDraft.consignee]);
  const [customDraft, setCustomDraft] = useState<CustomRequestDraft>(freshCustomDraft);
  const [savedDrafts, setSavedDrafts] = useState<MockBookingDraftRecord[]>([]);
  useEffect(() => {
    if (isRestoring) return;
    if (!customer) {
      setSavedDrafts([]);
      return;
    }
    let active = true;
    void repositories.bookings.listDrafts()
      .catch(() => readStoredDraftSummaries())
      .then((summaries) => {
        if (!active) return;
        setSavedDrafts(summaries.map((draft) => {
          const payload = objectValue(draft.payload);
          const form = objectValue(payload?.form);
          const savedDraft = objectValue(payload?.draft);
          const progress = progressParts(draft.progressLabel);
          return {
            id: draft.id,
            service: draft.service,
            title: draft.title,
            route: [form?.pickup, form?.destination].filter(Boolean).join(" → ") || "Route to confirm",
            stepLabel: progress.stepLabel,
            progress: progress.progress,
            updatedAt: draft.updatedAt,
            resumeHref: resumeHrefFor(draft.service, savedDraft),
            payload: draft.payload,
          };
        }));
      });
    return () => {
      active = false;
    };
  }, [customer?.id, isRestoring]);
  useEffect(() => {
    void writeStoredDraftSummaries(savedDrafts.map((draft) => ({
      id: draft.id,
      service: draft.service,
      title: draft.title,
      progressLabel: `${draft.stepLabel} · ${draft.progress}`,
      updatedAt: draft.updatedAt,
    })));
  }, [savedDrafts]);
  const removeSavedDraft = (id: string) => {
    setSavedDrafts((drafts) => drafts.filter((draft) => draft.id !== id));
    void repositories.bookings.deleteDraft?.(id).catch(() => undefined);
  };
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
      if (saved.service === "local") setLocalDraft({ ...freshDraft(), ...(draftFromPayload<LocalDeliveryDraft>(saved.payload) ?? { step: "contacts", pickup: { city: "Lusaka", area: "Olympia", detail: "Manda Hill Road", label: "Manda Hill" }, destination: { city: "Lusaka", area: "Kabulonga", detail: "Bishop Road", label: "Kabulonga" }, parcelCategory: "Parcel", parcelDescription: "Small cargo parcel", quantity: 1, vehicle: "scooter" }) });
      if (saved.service === "import") setImportDraft({ ...freshImportDraft(), ...(draftFromPayload<ImportBookingDraft>(saved.payload) ?? { method: "air", originCountry: "China", originCity: "Guangzhou", destinationCity: "Lusaka", cargoCategory: "General cargo", quantity: 1 }) });
      if (saved.service === "intercity") setIntercityDraft({ ...freshIntercityDraft(), ...(draftFromPayload<IntercityBookingDraft>(saved.payload) ?? { originCity: "Lusaka", destinationCity: "Kitwe", cargoCategory: "Parcel", quantity: 1 }) });
      if (saved.service === "custom") setCustomDraft({ ...freshCustomDraft(), ...(draftFromPayload<CustomRequestDraft>(saved.payload) ?? { pickup: { city: "Lusaka", area: "Woodlands", detail: "Chindo Road", label: "Woodlands" }, destination: { city: "Ndola", area: "Town Centre", detail: "Broadway", label: "Ndola" } }) });
      return saved.resumeHref;
    },
    deleteSavedDraft: removeSavedDraft,
  }), [localDraft, importDraft, intercityDraft, customDraft, savedDrafts]);
  return <BookingDraftContext.Provider value={value}>{children}</BookingDraftContext.Provider>;
}

export function useBookingDraft() {
  const context = useContext(BookingDraftContext);
  if (!context) throw new Error("useBookingDraft must be used within BookingDraftProvider");
  return context;
}
