import { describe, expect, it } from "vitest";
import { startupDestination, startupScenarioLabel } from "../lib/startup-flow";

describe("New WorldCargo startup and recovery states", () => {
  it("routes normal startup to the correct signed-in or signed-out destination", () => {
    expect(startupDestination("normal", false)).toBe("/auth/welcome");
    expect(startupDestination("normal", true)).toBe("/(tabs)");
  });

  it("holds recovery scenarios on the dedicated state screen", () => {
    expect(startupDestination("offline", false)).toBe("/startup");
    expect(startupDestination("maintenance", true)).toBe("/startup");
    expect(startupDestination("required_update", true)).toBe("/startup");
    expect(startupDestination("outage", false)).toBe("/startup");
  });

  it("uses customer-readable labels for each selectable mock scenario", () => {
    expect(startupScenarioLabel("restoring")).toBe("Restoring session");
    expect(startupScenarioLabel("optional_update")).toBe("Optional update");
  });
});
