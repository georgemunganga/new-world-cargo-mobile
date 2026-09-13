import { describe, expect, it } from "vitest";
import { mockAddressBookRepository } from "../lib/adapters/mock/mock-address-book-adapter";

describe("mobile address-book repository", () => {
  it("creates and updates saved recipients through the repository boundary", async () => {
    const created = await mockAddressBookRepository.saveDirectoryItem("recipients", {
      label: "George Munganga",
      detail: "Lusaka · +260971234567",
    });

    expect(created.id).toMatch(/^recipients-/);
    expect((await mockAddressBookRepository.listRecipients()).some((item) => item.id === created.id)).toBe(true);

    const updated = await mockAddressBookRepository.saveDirectoryItem("recipients", {
      id: created.id,
      label: "George M.",
      detail: "Kitwe · +260971234567",
    });

    expect(updated).toMatchObject({ id: created.id, label: "George M.", detail: "Kitwe · +260971234567" });
  });

  it("removes saved places through the repository boundary", async () => {
    const created = await mockAddressBookRepository.saveDirectoryItem("places", {
      label: "Warehouse",
      detail: "Lusaka Industrial Area",
    });

    await mockAddressBookRepository.removeDirectoryItem("places", created.id);

    expect((await mockAddressBookRepository.listSavedPlaces()).some((item) => item.id === created.id)).toBe(false);
  });
});
