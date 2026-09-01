import { describe, expect, it } from "vitest";
import { getDefaultPaymentMethod, mockSavedPaymentMethods, paymentMethodDetail, paymentMethodIcon } from "../lib/mock-billing";
import { mockRecipients, mockSavedPlaces } from "../lib/mock-account-directory";
import { mockSupportCases, mockSupportStatusLabel, mockSupportStatusTone } from "../lib/mock-support";

describe("mock account destinations", () => {
  it("supplies a customer default payment method and concise presentation details", () => {
    expect(getDefaultPaymentMethod(mockSavedPaymentMethods)?.id).toBe("wallet");
    expect(paymentMethodDetail("wallet", 1750)).toBe("Available K 1,750.00");
    expect(paymentMethodIcon("card")).toBe("credit-card-outline");
  });

  it("provides saved places and recipients ready for a later booking connection", () => {
    expect(mockSavedPlaces).toHaveLength(2);
    expect(mockSavedPlaces[0]).toMatchObject({ label: "Home", detail: "Roma, Lusaka" });
    expect(mockRecipients).toHaveLength(2);
    expect(mockRecipients[0].detail).toContain("Lusaka");
  });

  it("presents customer support cases with clear status labels and tones", () => {
    expect(mockSupportCases[0].status).toBe("waiting");
    expect(mockSupportStatusLabel("open")).toBe("Open");
    expect(mockSupportStatusTone("resolved")).toBe("success");
  });
});
