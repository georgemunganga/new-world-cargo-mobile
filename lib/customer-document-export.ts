import type { MockInvoice } from "@/lib/mock-billing";

export type CustomerDocumentExportResult = { status: "downloaded" | "unavailable"; filename: string };

export function receiptFilename(invoice: Pick<MockInvoice, "reference">) { return `new-worldcargo-receipt-${invoice.reference.toLowerCase()}.html`; }

export function buildReceiptDocument(invoice: MockInvoice) {
  const paidDate = invoice.paidAt ?? "Confirmed in mock preview";
  const items = invoice.lineItems.map((item) => `<tr><td><strong>${escapeHtml(item.label)}</strong>${item.detail ? `<br><span>${escapeHtml(item.detail)}</span>` : ""}</td><td>${escapeHtml(item.amount)}</td></tr>`).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Receipt ${escapeHtml(invoice.reference)}</title><style>body{margin:0;background:#f5f7f7;color:#012642;font-family:Arial,sans-serif}.page{max-width:680px;margin:32px auto;background:#fff;padding:38px;border-radius:20px;box-sizing:border-box}.brand{color:#012642;font-weight:800;font-size:22px}.badge{display:inline-block;margin-top:12px;padding:7px 11px;border-radius:999px;background:#dff3e8;color:#147145;font-size:12px;font-weight:700}.title{font-size:32px;margin:25px 0 5px}.muted{color:#56707d;line-height:1.5}.total{margin:28px 0;padding:20px;border-radius:16px;background:#edf4f7;font-size:28px;font-weight:800}.total span{display:block;color:#56707d;font-size:12px;margin-bottom:5px}table{width:100%;border-collapse:collapse;margin-top:20px}td{padding:15px 0;border-top:1px solid #e3e9eb;vertical-align:top}td:last-child{text-align:right;font-weight:700;white-space:nowrap}td span{color:#56707d;font-size:13px;line-height:1.45}.foot{margin-top:32px;padding-top:18px;border-top:1px solid #e3e9eb;color:#56707d;font-size:12px;line-height:1.5}</style></head><body><main class="page"><div class="brand">NEW WORLDCARGO</div><div class="badge">PAYMENT RECEIVED</div><h1 class="title">Payment receipt</h1><p class="muted">${escapeHtml(invoice.reference)} · Shipment ${escapeHtml(invoice.shipmentReference)}<br>Paid ${escapeHtml(paidDate)} via ${escapeHtml(invoice.paymentMethod ?? "Mock payment method")}</p><div class="total"><span>Amount paid</span>${escapeHtml(invoice.amount)}</div><h2>Charge summary</h2><table>${items}</table><div class="foot">Route: ${escapeHtml(invoice.route)}<br>This is a deterministic development receipt from the New WorldCargo frontend preview. A connected payment provider will issue the final production receipt.</div></main></body></html>`;
}

export function exportReceipt(invoice: MockInvoice): CustomerDocumentExportResult {
  const filename = receiptFilename(invoice);
  if (typeof document === "undefined" || typeof URL === "undefined") return { status: "unavailable", filename };
  const blob = new Blob([buildReceiptDocument(invoice)], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 0);
  return { status: "downloaded", filename };
}

function escapeHtml(value: string) { return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character); }
