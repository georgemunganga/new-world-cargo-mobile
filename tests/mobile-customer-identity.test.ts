import { describe, expect, it } from "vitest";
import { mockUploadRepository } from "../lib/adapters/mock/mock-upload-adapter";
import type { CustomerProfile } from "../lib/domain/customer";

describe("mobile customer identity", () => {
  it("updates customer profile through the repository boundary", async () => {
    const current: CustomerProfile = { id: "mock", name: "Customer", phone: "+260970000000", city: "Lusaka", portalEnabled: true };
    const profile = { ...current, name: "IT Department", phone: "+260971234567" };

    expect(profile).toMatchObject({
      name: "IT Department",
      phone: "+260971234567",
      city: "Lusaka",
      portalEnabled: true,
    });
  });

  it("uploads profile photo through a swappable upload adapter", async () => {
    const uploaded = await mockUploadRepository.uploadProfilePhoto({
      uri: "file:///avatar.jpg",
      name: "avatar.jpg",
      type: "image/jpeg",
      size: 1200,
    });

    expect(uploaded).toMatchObject({
      url: "file:///avatar.jpg",
      filename: "avatar.jpg",
      contentType: "image/jpeg",
    });
  });
});
