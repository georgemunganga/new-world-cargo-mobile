import { describe, expect, it } from "vitest";
import { recipientToBookingContact, savedPlaceToAddress } from "../lib/account-directory-booking";

describe("account directory booking transforms", () => {
  it("converts a saved place to the Local Delivery address contract", () => {
    expect(savedPlaceToAddress({ id: "home", label: "Home", detail: "Roma, Lusaka" })).toEqual({ label: "Home", detail: "Home · Roma, Lusaka", area: "Roma", city: "Lusaka" });
  });

  it("converts a saved recipient to booking contact fields", () => {
    expect(recipientToBookingContact({ id: "john", label: "John Banda", detail: "Lusaka · 097 220 1448" })).toEqual({ name: "John Banda", phone: "097 220 1448" });
  });
});
