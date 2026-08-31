import { describe, expect, it } from "vitest";
import { describeMockRoute, searchMockAddresses } from "../lib/mock-addresses";
import { mockPaymentPresentation } from "../lib/mock-billing";
import { permissionStatusLabel } from "../lib/mock-permissions";
import { defaultNotificationPreferences } from "../stores/notification-preferences";

describe("permission, route, payment, and notification experience expansion", () => {
  it("uses customer-readable permission states", () => {
    expect(permissionStatusLabel("not_requested")).toBe("Not requested");
    expect(permissionStatusLabel("denied")).toBe("Not allowed");
  });

  it("searches addresses by landmark and provides a safe route alternative before a route is selected", () => {
    expect(searchMockAddresses("warehouse")[0]?.type).toBe("warehouse");
    expect(describeMockRoute()).toContain("Choose both pickup and delivery locations");
  });

  it("describes a selected written route independently of the visual map", () => {
    const route = describeMockRoute({ city: "Lusaka", area: "Longacres", detail: "Cairo Road" }, { city: "Lusaka", area: "Roma", detail: "Great East Road" });
    expect(route).toContain("Cairo Road");
    expect(route).toContain("Great East Road");
  });

  it("maps payment states to distinct customer recovery messages", () => {
    expect(mockPaymentPresentation("confirmed").title).toBe("Payment received.");
    expect(mockPaymentPresentation("failed").tone).toBe("error");
    expect(mockPaymentPresentation("delayed").detail).toContain("Do not make another payment");
  });

  it("keeps operational updates enabled by default while marketing starts off", () => {
    expect(defaultNotificationPreferences).toEqual({ shipmentUpdates: true, billUpdates: true, marketing: false });
  });
});
