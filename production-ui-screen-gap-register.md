# New WorldCargo Mobile Production UI Screen Gap Register

## Production UI verdict

The project has strong **frontend prototype coverage**: the main customer journeys have routes, reusable components, deterministic state, and clean static validation. It should **not yet be described as production-ready UI**. Several customer destinations are missing or partial, some visible actions lead to a missing route, and the UI has not completed physical-device, accessibility, network-interruption, or production-service boundary review. [1]

> **Current classification:** a validated, frontend-only mobile customer prototype with extensive mock workflows—not a production-ready customer application.

## Coverage by customer journey

| Customer journey | UI coverage | Current state | Production UI conclusion |
|---|---:|---|---|
| Start, onboarding, sign-in, registration, recovery | Broad | Welcome, phone, verification, registration, recovery, and startup/recovery screens exist. OTP delivery, Google login, backend errors, and account recovery are mock-only. | **UI complete enough for prototype; service-dependent for production.** |
| Home and global navigation | Broad | Home, service entry, floating navigation, tracking overlay, notification entry, and support entry exist. | **Partial.** Home needs explicit long-label and empty states; notification badge is static. |
| Local, import, intercity, and custom booking | Broad | Local, Import, and City-to-City have tailored steps, route entry, review, and confirmation. Custom Request has route and details but lacks a full review/edit/manual-destination parity path. | **P0 UI gap: finish Custom Request.** |
| Booking continuity | Broad | Saved drafts, resume, delete confirmation, saved-place autofill, and recipient autofill are present. | **Prototype-complete.** Persistence remains service-dependent. |
| Public lookup and shipment tracking | Broad | Full-screen lookup overlay, typed-code fallback, loading/not-found/retry state, map-first live tracking, history, copy/share, pickup and delivery management, proof download, and return initiation exist. | **Partial.** Returns need a history/status destination; live mapping/contact actions remain mock-only. |
| Shipments and delivery detail | Broad | Search, status filters, active/delivered details, management entry, proof, and route identity are available. | **Partial.** List/detail loading, long-label, and exception states need a final sweep. |
| Bills, payment, wallet, and receipts | Broad | Invoice ledger, filters, detail, payment states, wallet, reminders, disputes, receipt history, and browser document export are present. | **Prototype-complete.** Real payment, persistence, and native document sharing are service-dependent. |
| Notifications | Partial | Inbox screen and notification state concepts exist. Both Account and inbox point to `/notifications/preferences`, but that route is missing. Inbox management and empty states are incomplete. | **P0 UI gap: add the missing preferences route.** |
| Account, directory, settings, and support | Broad | Saved places, recipients, payment methods, security/data/legal settings, recovery, support, form drawers, and approval dialogs exist. | **Partial.** Support creation needs to open the created case; profile photo and full legal documents are missing. |
| Permissions and device-specific capabilities | Broad mock UI | Education and denied/manual-alternative screens exist for the relevant device features. | **UI prototype complete; native integration remains future work.** |

## Must-complete screen batch before calling the UI production-ready

| Priority | Missing or partial screen/state | Why it blocks a production UI claim | Proposed mobile treatment |
|---|---|---|---|
| P0 | Notification Preferences | A visible Account and Inbox action has no destination. | One focused preferences screen with operational/marketing sections, save state, and all-off confirmation. |
| P0 | Custom Request review/edit/manual destination | One booking service ends sooner than the rest. | Add review before confirmation, edit links returning to the relevant step, and manual destination sheet. |
| P1 | Returns history and status | A submitted return disappears after confirmation. | Account/Shipments return list with Submitted, Reviewing, Approved, Handover, and Completed timeline. |
| P1 | Notification inbox management | Customers cannot manage notification state or recover from an empty list. | Read/unread, Mark all read, empty state, Home badge count, and retryable unavailable state. |
| P1 | Support case success/detail | New support cases do not open the generated case detail. | Navigate to the new case and show a concise case timeline with attachment metadata. |
| P1 | Profile photo and full policy pages | Account says profile/security/privacy, but visual profile control and readable policy destinations are incomplete. | Profile photo sheet plus individual Terms, Privacy, and Refund policy pages. |
| P1 | Cross-screen loading/empty/error pass | Major lists do not yet have all standard state variants. | Reusable empty/error/loading cards for Home, Shipments, Bills, Account, and Notifications. |
| P0 release gate | Physical-device and accessibility review | Static checks cannot validate status-bar fit, keyboard overlap, system bars, text scaling, screen reader sequence, map gestures, or network interruption. | Test on small and large Android/iOS devices using the checklist and convert all defects into tracked UI items. |

## Clearly separated production-service dependencies

The following do **not** require additional screen design before a UI production claim, but they prevent the full app from being released as a production service. They should remain behind their existing mock/provider boundaries until the product decides to integrate them: verified SMS/email authentication, payment gateway and wallet ledger, shipment telemetry/GPS, maps/geocoding, native QR camera scanning, device gallery/documents, push delivery, support attachment storage, backend persistence, and deep-link verification. [2]

## Recommended next implementation order

First remove the broken Notification Preferences navigation. Then finish Custom Request parity, build Returns history, and make support-case submission land in a real case-detail state. After that, run a horizontal state pass to fill empty/loading/error/retry variants across all customer lists. Finally, complete physical-device and accessibility review before considering a UI production sign-off.

## Validation at audit time

TypeScript compilation passed. The deterministic suite passed **76 tests**, with **one existing skipped test**. Expo lint passed with only the known template module-type warning. These results confirm static implementation health; they do not replace device, accessibility, integration, or operational readiness testing.

## References

[1] [New WorldCargo mobile route inventory](https://github.com/georgemunganga/new-world-cargo-mobile/tree/main/app)

[2] [New WorldCargo mobile implementation and quality guidance](https://docs.expo.dev/)
