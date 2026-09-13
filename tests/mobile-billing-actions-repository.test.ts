import { describe, expect, it } from "vitest";
import { mockBillingActionsRepository } from "../lib/adapters/mock/mock-billing-actions-adapter";
import { canPayWithWallet, paymentMethodLabel, paymentPresentation } from "../lib/domain/billing";

const invoice = { id: "inv-test", reference: "INV-TEST", amount: { amount: 120, currencyCode: "ZMW", formatted: "K 120.00" } };

describe("mobile billing actions repository", () => {
  it("manages payment methods through the repository boundary", async () => {
    const saved = await mockBillingActionsRepository.savePaymentMethod("card");
    const methods = await mockBillingActionsRepository.setDefaultPaymentMethod(saved.id);

    expect(methods.find((method) => method.id === saved.id)?.isDefault).toBe(true);
    expect(paymentMethodLabel(saved.method)).toBe("Bank card");
  });

  it("confirms wallet payment only when balance covers the invoice", async () => {
    expect(canPayWithWallet(100, invoice)).toBe(false);

    const failed = await mockBillingActionsRepository.confirmInvoicePayment({ invoice, method: "wallet", walletBalance: 50 });
    const paid = await mockBillingActionsRepository.confirmInvoicePayment({ invoice, method: "wallet", walletBalance: 200 });

    expect(failed.state).toBe("failed");
    expect(paid).toMatchObject({ state: "confirmed", walletBalance: 80 });
  });

  it("returns presentation and dispute state from domain-backed helpers", async () => {
    expect(paymentPresentation("delayed").title).toContain("little more time");
    expect((await mockBillingActionsRepository.disputeInvoice("inv-test"))?.kind).toBe("dispute");
  });
});
