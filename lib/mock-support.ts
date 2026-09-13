import { supportStatusLabel, supportStatusTone, type SupportCase, type SupportCaseStatus } from "@/lib/domain/support";

export type MockSupportCaseStatus = SupportCaseStatus;
export type MockSupportCase = SupportCase;

export const mockSupportCases: MockSupportCase[] = [
  { id: "case-241", title: "Delivery timing question", detail: "NWC-24518 · International cargo", status: "waiting", updatedAt: "Today", events: [{ label: "Question received", detail: "We matched your question to the shipment.", time: "Today, 09:10" }, { label: "Team update pending", detail: "A cargo specialist will update this request.", time: "Next update pending" }] },
];

export const mockSupportStatusLabel = supportStatusLabel;
export const mockSupportStatusTone = supportStatusTone;
