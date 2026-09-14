import { describe, expect, it } from "vitest";

import { paymentStateFromProvider } from "../lib/adapters/laravel/laravel-billing-actions-adapter";

describe("Laravel payment status mapping", () => {
  it("only confirms explicit successful provider statuses", () => {
    expect(paymentStateFromProvider("succeeded")).toBe("confirmed");
    expect(paymentStateFromProvider("requires_action")).toBe("delayed");
    expect(paymentStateFromProvider("processing")).toBe("delayed");
    expect(paymentStateFromProvider("failed")).toBe("failed");
    expect(paymentStateFromProvider("cancelled")).toBe("failed");
    expect(paymentStateFromProvider(undefined)).toBe("failed");
  });
});
