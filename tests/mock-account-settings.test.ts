import { describe, expect, it } from "vitest";
import { accountPolicySummaries, mockRecognizedDevices } from "../lib/mock-account-settings";

describe("mock account settings", () => {
  it("includes a current device that cannot be accidentally removed by default", () => {
    expect(mockRecognizedDevices.find((device) => device.current)?.name).toBe("This phone");
  });

  it("provides customer-facing legal policy summaries", () => {
    expect(accountPolicySummaries.map((policy) => policy.id)).toEqual(["terms", "privacy", "payments"]);
  });
});
