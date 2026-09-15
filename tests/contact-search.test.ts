import { describe, expect, it } from "vitest";
import { contactMatchesQuery } from "../lib/contact-search";
const contact = { name: "Test Recipient", phone: "+260971234567" };
describe("device contact suggestions", () => {
  it("matches names without case sensitivity", () => {
    expect(contactMatchesQuery(contact, "RECIP")).toBe(true);
    expect(contactMatchesQuery(contact, "unknown")).toBe(false);
  });
  it("matches local and international phone formats", () => {
    expect(contactMatchesQuery(contact, "0971")).toBe(true);
    expect(contactMatchesQuery(contact, "+260 971")).toBe(true);
    expect(contactMatchesQuery({ name: "Supplier", phone: "+447700900123" }, "+44 7700")).toBe(true);
  });
  it("ignores short searches and unrelated input", () => {
    expect(contactMatchesQuery(contact, "0")).toBe(false);
    expect(contactMatchesQuery(contact, "  ")).toBe(false);
    expect(contactMatchesQuery(contact, "person0971")).toBe(false);
  });
});
