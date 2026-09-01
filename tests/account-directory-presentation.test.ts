import { describe, expect, it } from "vitest";
import { getDirectoryEditorPresentation } from "../lib/account-directory-presentation";

describe("account directory editor presentation", () => {
  it("uses a location-finder drawer for saved places", () => {
    expect(getDirectoryEditorPresentation("places")).toBe("location-drawer");
  });

  it("uses a focused modal for recipients", () => {
    expect(getDirectoryEditorPresentation("recipients")).toBe("modal");
  });
});
