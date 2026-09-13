import { mockSupportCases } from "@/lib/mock-support";
import type { SupportCase } from "@/lib/domain/support";
import type { SupportRepository } from "@/lib/repositories/types";

const cases: SupportCase[] = [...mockSupportCases];

export const mockSupportRepository: SupportRepository = {
  async listCases() {
    return cases;
  },
  async createCase(input) {
    const created: SupportCase = {
      id: `case-${cases.length + 1}`,
      title: input.topic,
      detail: input.detail,
      status: "open",
      updatedAt: "Just now",
      events: [
        { label: "Request created", detail: "Your request is ready for a future support connection.", time: "Just now" },
        { label: "New WorldCargo review", detail: "A support update will appear here.", time: "Next update pending" },
      ],
    };
    cases.unshift(created);
    return created;
  },
};
