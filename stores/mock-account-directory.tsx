import { createContext, useContext, useMemo, useState, type PropsWithChildren } from "react";
import { mockRecipients, mockSavedPlaces, type MockDirectoryItem, type MockDirectoryKind } from "@/lib/mock-account-directory";

type MockAccountDirectoryContextValue = { savedPlaces: MockDirectoryItem[]; recipients: MockDirectoryItem[]; saveDirectoryItem: (kind: MockDirectoryKind, item: Omit<MockDirectoryItem, "id"> & { id?: string }) => void; removeDirectoryItem: (kind: MockDirectoryKind, id: string) => void };
const MockAccountDirectoryContext = createContext<MockAccountDirectoryContextValue | null>(null);

export function MockAccountDirectoryProvider({ children }: PropsWithChildren) {
  const [savedPlaces, setSavedPlaces] = useState(mockSavedPlaces);
  const [recipients, setRecipients] = useState(mockRecipients);
  const saveDirectoryItem = (kind: MockDirectoryKind, item: Omit<MockDirectoryItem, "id"> & { id?: string }) => {
    const update = (current: MockDirectoryItem[]) => item.id ? current.map((entry) => entry.id === item.id ? { ...entry, label: item.label, detail: item.detail } : entry) : [...current, { id: `${kind}-${current.length + 1}`, label: item.label, detail: item.detail }];
    if (kind === "places") setSavedPlaces(update); else setRecipients(update);
  };
  const removeDirectoryItem = (kind: MockDirectoryKind, id: string) => { if (kind === "places") setSavedPlaces((current) => current.filter((item) => item.id !== id)); else setRecipients((current) => current.filter((item) => item.id !== id)); };
  const value = useMemo(() => ({ savedPlaces, recipients, saveDirectoryItem, removeDirectoryItem }), [recipients, savedPlaces]);
  return <MockAccountDirectoryContext.Provider value={value}>{children}</MockAccountDirectoryContext.Provider>;
}

export function useMockAccountDirectory() {
  const context = useContext(MockAccountDirectoryContext);
  if (!context) throw new Error("useMockAccountDirectory must be used within MockAccountDirectoryProvider");
  return context;
}
