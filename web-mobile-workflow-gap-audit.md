# New WorldCargo Web-to-Mobile Customer Workflow Audit

## Executive summary

The mobile app now covers the principal customer paths for shipment discovery, service-specific booking, map-aware route selection, tracking, billing, payment states, wallet behavior, receipts, saved places, recipients, recovery, and support cases. The remaining gaps are mainly **customer actions that continue or close a workflow**, not a lack of core screens.

The most immediate gap is document export: mobile presents receipt and proof-of-delivery states, but it does not yet create a downloadable customer document. This should be addressed first with a browser-safe export module that can later delegate to native sharing and file storage.

> **Scope:** The web portal is a workflow reference. Mobile remains frontend-only and deterministic until the user explicitly requests integrations.

## Parity overview

| Web workflow | Mobile status | Mobile assessment |
|---|---|---|
| Shipment list, search, filters, and detail | Implemented | Mobile has filtered shipment discovery and active-vs-completed routing. |
| Service-specific cargo booking | Implemented | Mobile goes beyond the web reference with tailored Local Delivery, Import, City-to-City, and Custom Request flows. |
| Route search and route estimate | Mock-only | Mobile has deterministic service-aware location search, map context, pin adjustment, vehicle selection, and estimate states. |
| Shipment tracking and share | Partial | Map-first live tracking, status progress, and mock share actions exist; QR scan is still a UI/permission future state. |
| Invoice ledger, payment, wallet, and receipt history | Partial | The invoice workflow is complete with mock data, but document actions are currently feedback rather than actual download/share. |
| Proof of delivery | Partial | Mobile shows mock signature/photo confirmation, but cannot export or share the proof. |
| Saved places and recipients | Partial | Add, edit, and remove states exist; recipient search and booking autofill are not yet connected. |
| Pickup management | Missing | Existing bookings cannot yet be rescheduled, cancelled, or reported as missed from a dedicated pickup flow. |
| Saved shipment drafts | Missing | Booking draft state exists in memory, but customers cannot browse, resume, or delete saved drafts. |
| Return request | Missing | There is no eligibility, reason, handover, or confirmation journey for returns. |
| Support cases | Partial | Support and charge-review cases exist; mock file attachment and richer case detail remain absent. |
| Security / sign-in activity | Missing | Auth and recovery exist, but customers cannot inspect or revoke recognized devices. |
| Profile photo, data controls, legal policies | Missing | Account profile essentials remain unfinished. |
| Notifications | Partial | Preferences and inbox states exist; read/unread filters and “mark all read” management are still incomplete. |

## Prioritized build order

| Priority | Customer workflow | Why it matters | Frontend-only implementation |
|---|---|---|---|
| P0 | **Receipt and proof-of-delivery export** | Customers explicitly need to keep financial and delivery records. | Generate a deterministic document file in browser; route native later through a share/save adapter. |
| P1 | **Pickup and shipment management** | Customers need to act after booking, not only track. | Reschedule, cancel, missed-pickup help, instructions, eligibility, and exception states using mock rules. |
| P1 | **Drafts and booking autofill** | Reduces abandoned bookings and repeats. | Draft list/resume/delete plus saved-place and recipient quick-fill. |
| P1 | **Returns** | Completes the delivered-shipment lifecycle. | Eligibility, reason, handover method, review, and submitted timeline. |
| P2 | **Security, profile, policies** | Rounds out customer self-service and trust. | Mock sign-in activity, device actions, profile photo, data controls, and legal destinations. |
| P2 | **QR and attachments** | Helpful for operational efficiency, but needs later native permissions and storage. | Permission-aware mock camera/document UI with future-provider seams. |

## Customer actions currently shown but not yet functional

| Visible mobile action | Current behavior | Required next behavior |
|---|---|---|
| Download receipt | Mock confirmation / feedback | Create a downloadable receipt document. |
| Share receipt | Mock confirmation / feedback | Use browser share/download fallback, with a native share adapter later. |
| Download proof of delivery | Proof display only | Create and export proof document with delivery confirmation details. |
| Scan tracking QR | Permission education / mock UI | Open browser-safe scan-entry mock, then native camera adapter later. |
| Attach support evidence | Case UI only | Display attachment selection/progress mock with later file-storage adapter. |
| Add recipient/place | Saved separately | Offer selection inside booking to prefill contact or route values. |

## Recommended next implementation

Implement a shared **customer-document export adapter** next. It will accept a receipt or proof-of-delivery document model, produce a customer-readable download in the browser, and expose a single future seam for native sharing. This resolves the explicit receipt-download issue and prevents two separate document implementations.

## Web reference

[1] [New WorldCargo public web customer pages](https://github.com/Newworldcargo/new-world-cargo-app/tree/main/client/src/pages)
