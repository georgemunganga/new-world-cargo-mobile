import { describe, expect, it } from "vitest";
import { isInLocalCity } from "../lib/maps/local-city";
const city = { city: "Lusaka", latitude: -15.4, longitude: 28.3 };
describe("local city restriction", () => {
  it("accepts neighbourhoods identified as part of the same city district", () => {
    expect(isInLocalCity({ city: "Kabwata", cityDistrict: "Lusaka District", latitude: -15.43, longitude: 28.32 }, city)).toBe(true);
    expect(isInLocalCity({ city: "Lusaka District", latitude: -15.4, longitude: 28.3 }, city)).toBe(true);
    expect(isInLocalCity({ city: "City of Lusaka", latitude: -15.4, longitude: 28.3 }, city)).toBe(true);
  });
  it("does not treat province membership or proximity as city membership", () => {
    expect(isInLocalCity({ city: "Chongwe", cityDistrict: "Lusaka Province", latitude: -15.33, longitude: 28.68 }, city)).toBe(false);
    expect(isInLocalCity({ city: "Chilanga", cityDistrict: "Chilanga District", latitude: -15.56, longitude: 28.28 }, city)).toBe(false);
    expect(isInLocalCity({ city: "", latitude: -15.4, longitude: 28.3 }, city)).toBe(false);
  });
  it("allows another address in the detected city", () => {
    expect(isInLocalCity({ city: " lusaka ", latitude: -15.3, longitude: 28.4 }, city)).toBe(true);
  });
  it("rejects another city, missing GPS and coordinates outside Zambia", () => {
    expect(isInLocalCity({ city: "Kitwe", latitude: -12.8, longitude: 28.2 }, city)).toBe(false);
    expect(isInLocalCity(city, undefined)).toBe(false);
    expect(isInLocalCity({ city: "Lusaka" }, city)).toBe(false);
    expect(isInLocalCity({ ...city, latitude: 51 }, city)).toBe(false);
  });
});
