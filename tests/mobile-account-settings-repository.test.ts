import { describe, expect, it } from "vitest";
import { mockAccountSettingsRepository } from "../lib/adapters/mock/mock-account-settings-adapter";
import { accountPolicySummaries, removeRecognizedDevice } from "../lib/domain/account-settings";

describe("mobile account settings repository", () => {
  it("loads recognized devices and privacy settings", async () => {
    const settings = await mockAccountSettingsRepository.getSettings();

    expect(settings.devices.some((device) => device.current)).toBe(true);
    expect(settings.marketingEnabled).toBe(true);
  });

  it("does not remove the current device by accident", () => {
    const devices = [{ id: "this-device", name: "This phone", detail: "Active", current: true }];

    expect(removeRecognizedDevice(devices, "this-device")).toHaveLength(1);
  });

  it("records data export and account deletion requests", async () => {
    const exported = await mockAccountSettingsRepository.requestDataExport();
    const deleted = await mockAccountSettingsRepository.requestAccountDeletion();

    expect(exported.dataExportRequested).toBe(true);
    expect(deleted.deletionRequested).toBe(true);
    expect(accountPolicySummaries.map((policy) => policy.id)).toEqual(["terms", "privacy", "payments"]);
  });
});
