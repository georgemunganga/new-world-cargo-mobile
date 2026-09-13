import { describe, expect, it } from "vitest";
import { toUiShipment } from "../lib/mappers/shipment-ui-mapper";
import type { CustomerShipment } from "../lib/domain/shipment";

describe("shipment UI mapper", () => {
  it("keeps screens isolated from backend/domain shipment shape", () => {
    const shipment: CustomerShipment = {
      id: "37726",
      code: "EXP-LUN10001",
      title: "International cargo",
      service: "import",
      status: "in_transit",
      origin: { city: "China", area: "Guangzhou" },
      destination: { city: "Zambia", area: "Lusaka" },
      etaLabel: "Estimated 14 Sep",
    };

    expect(toUiShipment(shipment)).toMatchObject({
      id: "37726",
      reference: "EXP-LUN10001",
      service: "import",
      status: "in_transit",
      pickup: { city: "China", area: "Guangzhou" },
      destination: { city: "Zambia", area: "Lusaka" },
      eta: "Estimated 14 Sep",
    });
  });
});
