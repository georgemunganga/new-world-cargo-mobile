import { describe, expect, it } from "vitest";
import { getCustomerApprovalPresentation } from "../lib/customer-approval";

describe("customer approval presentation", () => {
  it("makes deletion and removal language explicit", () => {
    const presentation = getCustomerApprovalPresentation("account-deletion");
    expect(presentation.tone).toBe("danger");
    expect(presentation.approveLabel).toBe("Request deletion");
  });

  it("includes the selected pickup window in a reschedule confirmation", () => {
    expect(getCustomerApprovalPresentation("reschedule-pickup", "Tomorrow · 09:00–11:00").detail).toContain("Tomorrow");
  });
});
