export type CustomerApprovalKind = "remove-directory-item" | "remove-device" | "data-export" | "account-deletion" | "reschedule-pickup" | "cancel-pickup" | "pickup-help";

export type CustomerApprovalPresentation = { title: string; detail: string; approveLabel: string; tone: "primary" | "danger" };

export function getCustomerApprovalPresentation(kind: CustomerApprovalKind, subject?: string): CustomerApprovalPresentation {
  const item = subject?.trim() || "this item";
  switch (kind) {
    case "remove-directory-item": return { title: `Remove ${item}?`, detail: "It will no longer be available for booking autofill. You can add it again later.", approveLabel: "Remove", tone: "danger" };
    case "remove-device": return { title: `Remove ${item}?`, detail: "That device will need to sign in again before it can access this account.", approveLabel: "Remove device", tone: "danger" };
    case "data-export": return { title: "Request your data export?", detail: "A mock request will be recorded. Production accounts will receive a secure export when services are connected.", approveLabel: "Request export", tone: "primary" };
    case "account-deletion": return { title: "Request account deletion?", detail: "This mock request is recorded for review. Your development preview account is not removed automatically.", approveLabel: "Request deletion", tone: "danger" };
    case "reschedule-pickup": return { title: "Confirm new pickup window?", detail: `Your selected window is ${item}. We will update the collection plan in this mock preview.`, approveLabel: "Confirm change", tone: "primary" };
    case "cancel-pickup": return { title: "Cancel this pickup?", detail: "This releases the planned handover window. The shipment can be scheduled again later in this preview.", approveLabel: "Cancel pickup", tone: "danger" };
    case "pickup-help": return { title: "Request pickup help?", detail: "A mock support case will be created for a missed handover or access problem.", approveLabel: "Request help", tone: "primary" };
  }
}
