import {
  createCustomerQueryClient,
  restoreCustomerCache,
  type SavedCustomerCache,
} from "./customer-cache";
import { loadRouteReferenceData } from "@/lib/route-autocomplete";
import { useEffect, useState, type PropsWithChildren } from "react";
import { AppState } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import {
  QueryClientProvider,
  focusManager,
  onlineManager,
} from "@tanstack/react-query";
import { useCustomerAuth } from "@/stores/customer-auth";
import { customerQueries } from "./customer-queries";
import { readJsonStorage, writeJsonStorage } from "@/lib/storage/json-storage";

const cacheKey = "new-world-cargo.customer-data.v1";
export function CustomerDataProvider({ children }: PropsWithChildren) {
  const { customer } = useCustomerAuth();
  // A fresh client per identity prevents late responses leaking into another account.
  const owner = customer
    ? `${process.env.EXPO_PUBLIC_API_BASE_URL}:${customer.id}`
    : "guest";
  return (
    <CustomerDataSession key={owner} owner={owner}>
      {children}
    </CustomerDataSession>
  );
}
function CustomerDataSession({
  owner,
  children,
}: PropsWithChildren<{ owner: string }>) {
  const [client] = useState(createCustomerQueryClient);
  useEffect(() => {
    const app = AppState.addEventListener("change", (state) =>
      focusManager.setFocused(state === "active"),
    );
    const network = NetInfo.addEventListener((state) =>
      onlineManager.setOnline(
        state.isConnected !== false && state.isInternetReachable !== false,
      ),
    );
    return () => {
      app.remove();
      network();
    };
  }, []);
  useEffect(() => {
    if (owner === "guest") return;
    let active = true;
    let saveTimer: ReturnType<typeof setTimeout> | undefined;
    // Hydrate independently; never overwrite a newer network response with disk data.
    void readJsonStorage<SavedCustomerCache>(cacheKey)
      .then((saved) => {
        if (active) restoreCustomerCache(client, owner, saved);
      })
      .catch(() => {});
    const unsubscribe = client.getQueryCache().subscribe((event) => {
      if (event.type !== "updated" || event.action.type !== "success") return;
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        if (!active) return;
        const allowed = new Set([
          "profile",
          "shipments",
          "invoices",
          "recipients",
          "places",
          "notifications",
        ]);
        const entries = client
          .getQueryCache()
          .getAll()
          .filter(
            (q) =>
              allowed.has(String(q.queryKey[0])) && q.state.data !== undefined,
          )
          .map((q) => ({
            key: q.queryKey,
            data: q.state.data,
            updatedAt: q.state.dataUpdatedAt,
          }));
        void writeJsonStorage(cacheKey, { owner, entries }).catch(() => {});
      }, 250);
    });
    void client.prefetchQuery(customerQueries.profile);
    void client.prefetchQuery(customerQueries.shipments);
    void client.prefetchQuery(customerQueries.notifications);
    const secondary = setTimeout(() => {
      void client.prefetchQuery(customerQueries.places);
      void client.prefetchQuery(customerQueries.recipients);
      void client.prefetchQuery(customerQueries.invoices);
      void client.prefetchQuery(customerQueries.methods);
      void loadRouteReferenceData().catch(() => {});
    }, 500);
    return () => {
      active = false;
      clearTimeout(secondary);
      clearTimeout(saveTimer);
      unsubscribe();
      void client.cancelQueries();
      client.clear();
    };
  }, [client, owner]);
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
