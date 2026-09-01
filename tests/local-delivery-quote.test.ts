import { describe, expect, it } from "vitest";
import { getLocalDeliveryQuote } from "../lib/local-delivery-quote";

describe("Local Delivery mock quote", () => {
  const roma = { city: "Lusaka", area: "Roma", detail: "Great East Road" };
  const longacres = { city: "Lusaka", area: "Longacres", detail: "Cairo Road" };

  it("waits until both ends of the route are ready", () => {
    expect(getLocalDeliveryQuote(roma)).toBeNull();
    expect(getLocalDeliveryQuote(roma, { city: "Lusaka", area: "Woodlands", detail: "" })).toBeNull();
  });

  it("returns deterministic local price and arrival information for a selected route", () => {
    expect(getLocalDeliveryQuote(roma, longacres)).toEqual({ price: "K 68", eta: "Pickup in 7 min", distance: "4.2 km", arrivalWindow: "Delivery around 14:15", vehicleLabel: "Cargo bike", capacity: "Up to 8 kg" });
  });

  it("updates deterministic price and capacity when a larger vehicle is selected", () => {
    expect(getLocalDeliveryQuote(roma, longacres, "small_van")).toMatchObject({ price: "K 96", eta: "Pickup in 10 min", capacity: "Up to 50 kg" });
    expect(getLocalDeliveryQuote(roma, longacres, "cargo_van")).toMatchObject({ price: "K 130", eta: "Pickup in 14 min", capacity: "Up to 300 kg" });
  });
});
