# New WorldCargo Invoice Workflow Audit

## Scope and conclusion

The public web portal’s **`/invoices`** route is materially more complete than the current mobile Bills experience. The mobile application already establishes a useful payment foundation: an outstanding amount, mock payment-method selection, several payment-status states, and a receipt confirmation screen. However, it currently models one invoice rather than a customer billing record.

> **Recommended mobile workflow:** Bills ledger → invoice detail → payment method → pending/confirmed state → updated paid ledger → receipt and invoice actions.

The work below remains **frontend-only and deterministic**. It does not require a payment integration, file service, or live customer billing data.

## Workflow comparison

| Customer need | Web portal `/invoices` behavior | Current mobile behavior | Assessment |
|---|---|---|---|
| Understand what is owed | Totals all unpaid invoices into an outstanding balance. | Shows one outstanding amount. | **Missing multi-invoice balance context.** |
| Browse billing history | Separates recent and older invoice records. | Shows a single due card and a non-interactive empty receipts/refunds row. | **Missing invoice ledger and paid history.** |
| Find an invoice | Searches by invoice or shipment and filters All, Unpaid, and Paid. | No search or filters. | **Missing.** |
| Inspect a charge | Opens invoice details with shipment route, issued/due or paid date, line items, total, and payment context. | Routes directly to a payment screen with a summary only. | **Missing invoice detail before payment.** |
| Pay an unpaid invoice | Opens a payment workflow from the selected invoice. | Supports a mock payment-method selector and payment status path. | **Partially covered.** The selected invoice is not yet modeled. |
| See the payment result in Bills | Marks the corresponding invoice paid and makes its receipt available. | Shows a receipt screen, but Bills does not change from the outstanding invoice afterward. | **Missing billing-state mutation and history transition.** |
| Retain records | Downloads invoice copies; paid records also expose receipt download. | Shows receipt details only; no invoice or receipt export/share action. | **Missing.** |
| Recover from non-content states | Gives invoice-list loading, empty-search, and retryable error feedback. | No Bills-specific loading, no-results, or retry state. | **Missing.** |

## Existing mobile strengths to preserve

| Existing mobile capability | Why it should remain |
|---|---|
| Payment-method selection | It gives a clear, native-sized decision point for mobile money, bank card, and Cargo wallet. |
| Payment-state screen | Pending, confirmed, failed, cancelled, delayed, and refund presentations already cover important operational feedback. |
| Receipt confirmation | The confirmation screen provides an appropriate end-state after a successful mock payment. |
| Minimalist Bills hierarchy | The compact amount-due card is a useful summary pattern and should become the top of a richer invoice ledger rather than be removed. |

## Prioritized missing mobile workflows

| Priority | Workflow | Customer outcome | Suggested mock scope |
|---|---|---|---|
| P0 | Invoice ledger and status state | Customers see all paid and unpaid bills, grouped into recent and older records. | Four deterministic invoices with paid/unpaid status, amount, shipment, dates, and payment method. |
| P0 | Invoice detail | Customers can review itemized charges and due date before committing to payment. | Detail screen or bottom sheet with route, shipment, charge rows, total, and context banner. |
| P0 | Payment-to-history transition | A confirmed payment updates only that invoice and moves it to paid history. | In-memory invoice store; no external payment call. |
| P1 | Search and status filters | Customers can find an invoice or narrow the ledger by status. | Local string matching plus All/Unpaid/Paid controls. |
| P1 | Invoice/receipt share actions | Customers can access a mock document action from invoice detail and paid history. | Native-style mock action sheet or success feedback; no file generation required yet. |
| P1 | Loading, empty, and recoverable error states | Customers receive clear feedback instead of an incomplete page. | Query-driven deterministic UI states, consistent with existing app state patterns. |
| P2 | Refund record and payment timeline | Customers can understand refund or delayed-confirmation progress. | Reuse existing payment-state vocabulary in the invoice detail timeline. |

## Recommended implementation sequence

First replace the single `mockInvoice` with a small deterministic invoice ledger and add an in-memory billing store that can mark one selected invoice as paid. Then rebuild Bills around the summary balance, search/filter controls, and grouped invoice list. Next add a route-aware invoice detail screen; connect its Pay action to the existing payment-state flow. Finally, return successful payment to the updated ledger and expose mock invoice/receipt actions only for the relevant status.

This sequence preserves the current mobile visual language, keeps each payment action traceable to a specific cargo shipment, and avoids blocking UI development on live billing, payment, or document-generation services.

## Reference

[1] [New WorldCargo web invoice route — `Invoices.tsx`](https://github.com/Newworldcargo/new-world-cargo-app/blob/main/client/src/pages/Invoices.tsx)
