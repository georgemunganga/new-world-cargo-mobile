import { createReturnRequest, type ReturnRequest } from "@/lib/domain/return-request";
import type { ReturnRequestRepository } from "@/lib/repositories/types";

const requests: ReturnRequest[] = [];

export const mockReturnRequestRepository: ReturnRequestRepository = {
  async listRequests() {
    return requests;
  },
  async submitReturn(input) {
    const request = createReturnRequest(input);
    const existingIndex = requests.findIndex((item) => item.shipmentId === request.shipmentId);
    if (existingIndex >= 0) requests[existingIndex] = request;
    else requests.unshift(request);
    return request;
  },
};
