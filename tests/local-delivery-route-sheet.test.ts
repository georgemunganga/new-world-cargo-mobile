import { describe, expect, it } from "vitest";
import { getLocalDeliveryRouteSheetState, localDeliveryCompactSheetHeight } from "../lib/local-delivery-route-sheet";

describe("Local Delivery route sheet state", () => {
  it("keeps a compact bottom sheet while no route field is being edited", () => {
    expect(getLocalDeliveryRouteSheetState(null, 844)).toEqual({ mode: "compact", target: null, height: localDeliveryCompactSheetHeight });
  });

  it("expands to a keyboard-safe capped height while editing pickup or destination", () => {
    expect(getLocalDeliveryRouteSheetState("from", 844)).toEqual({ mode: "editing", target: "from", height: 600 });
    const destinationState = getLocalDeliveryRouteSheetState("to", 640);
    expect(destinationState.mode).toBe("editing");
    expect(destinationState.target).toBe("to");
    expect(destinationState.height).toBeCloseTo(460.8);
  });

  it("does not create an overly short expanded sheet on compact phone heights", () => {
    expect(getLocalDeliveryRouteSheetState("from", 500).height).toBe(440);
  });
});
