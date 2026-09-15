import { repositories as r } from "@/lib/repositories";
export const customerQueries = {
  profile: {
    queryKey: ["profile"],
    queryFn: () => r.customer.getProfile(),
    staleTime: 300_000,
  },
  shipments: {
    queryKey: ["shipments"],
    queryFn: () => r.shipments.listShipments(),
    staleTime: 30_000,
  },
  invoices: {
    queryKey: ["invoices"],
    queryFn: () => r.billing.listInvoices(),
    staleTime: 60_000,
  },
  recipients: {
    queryKey: ["recipients"],
    queryFn: () => r.addressBook.listRecipients(),
    staleTime: 300_000,
  },
  places: {
    queryKey: ["places"],
    queryFn: () => r.addressBook.listSavedPlaces(),
    staleTime: 300_000,
  },
  notifications: {
    queryKey: ["notifications"],
    queryFn: () => r.notifications.listNotifications(),
    staleTime: 30_000,
  },
  methods: {
    queryKey: ["methods"],
    queryFn: () => r.billingActions.listPaymentMethods(),
    staleTime: 300_000,
  },
  wallet: {
    queryKey: ["wallet"],
    queryFn: () => r.billingActions.getWallet(),
    staleTime: 30_000,
  },
  support: {
    queryKey: ["support"],
    queryFn: () => r.support.listCases(),
    staleTime: 60_000,
  },
  settings: {
    queryKey: ["settings"],
    queryFn: () => r.accountSettings.getSettings(),
    staleTime: 300_000,
  },
};
