export type MockSupportCaseStatus = "open" | "waiting" | "resolved";
export type MockSupportCase = { id: string; title: string; detail: string; status: MockSupportCaseStatus; updatedAt: string; events: { label: string; detail: string; time: string }[] };

export const mockSupportCases: MockSupportCase[] = [
  { id: "case-241", title: "Delivery timing question", detail: "NWC-24518 · International cargo", status: "waiting", updatedAt: "Today", events: [{ label: "Question received", detail: "We matched your question to the shipment.", time: "Today, 09:10" }, { label: "Team update pending", detail: "A cargo specialist will update this request.", time: "Next update pending" }] },
];

export function mockSupportStatusLabel(status: MockSupportCaseStatus) { return { open: "Open", waiting: "Waiting", resolved: "Resolved" }[status]; }
export function mockSupportStatusTone(status: MockSupportCaseStatus) { return { open: "warning" as const, waiting: "info" as const, resolved: "success" as const }[status]; }
