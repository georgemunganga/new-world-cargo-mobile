import { describe, expect, it } from "vitest";
import { mockSupportRepository } from "../lib/adapters/mock/mock-support-adapter";
import { supportStatusLabel, supportStatusTone } from "../lib/domain/support";

describe("mobile support repository", () => {
  it("lists existing support cases", async () => {
    const cases = await mockSupportRepository.listCases();

    expect(cases[0]?.title).toBeTruthy();
    expect(cases[0]?.events.length).toBeGreaterThan(0);
  });

  it("creates a support case and adds it to the case list", async () => {
    const created = await mockSupportRepository.createCase({ topic: "Charge review", detail: "INV-100 · EXP-LUN10001" });
    const cases = await mockSupportRepository.listCases();

    expect(created.status).toBe("open");
    expect(cases[0]?.id).toBe(created.id);
    expect(cases[0]?.detail).toContain("INV-100");
  });

  it("presents support statuses in customer language", () => {
    expect(supportStatusLabel("waiting")).toBe("Waiting");
    expect(supportStatusTone("resolved")).toBe("success");
  });
});
