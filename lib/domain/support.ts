export type SupportCaseStatus = "open" | "waiting" | "resolved";

export type SupportCaseEvent = {
  label: string;
  detail: string;
  time: string;
};

export type SupportCase = {
  id: string;
  title: string;
  detail: string;
  status: SupportCaseStatus;
  updatedAt: string;
  events: SupportCaseEvent[];
};

export type CreateSupportCaseInput = {
  topic: string;
  detail: string;
  shipmentReference?: string;
  invoiceReference?: string;
};

export function supportStatusLabel(status: SupportCaseStatus) {
  return { open: "Open", waiting: "Waiting", resolved: "Resolved" }[status];
}

export function supportStatusTone(status: SupportCaseStatus) {
  return { open: "warning" as const, waiting: "info" as const, resolved: "success" as const }[status];
}
