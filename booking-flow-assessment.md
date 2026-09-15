# Booking flow assessment

Status: In progress. Not a production or end-to-end sign-off.

## Verified

- Android local delivery opens a native Google map before addresses are selected; Zambia is the initial focus.
- Schematic/sample maps removed from the shared customer map component.
- Duplicate cargo heading removed and checked on Android.
- TypeScript passes after changes.
- Focused booking, pricing, geographic route, and configured-autocomplete tests pass.

## Implemented, requiring full device journey verification

- Zambia camera bounds for local delivery; this rectangular viewport boundary is not a national-border service authorization rule. Backend pricing remains authoritative.
- Full-screen local map picker: tap or drag the marker, reverse-geocode, validate detected city, then confirm. Arrow-nudge and duplicate manual address controls removed.
- Stale quote cleared during recalculation; expired quotes refreshed before continuing.
- Review recalculates server price after cargo/schedule edits and displays it before confirmation.
- Review rejects incomplete route/cargo/contact/schedule data.
- In-flight submission guard prevents simultaneous button-triggered requests. Server idempotency after ambiguous network failure still needs testing.
- Confirmation displays the server booking reference.
- Unsupported future-date option removed until a date/time flow exists.
- Nonfunctional Save as draft link removed from local review.
- Hard-coded autocomplete examples removed; configured offices and live place search provide suggestions.

## Remaining acceptance checks

- Complete Android booking using valid test or customer-supplied details; reconcile reference, price and shipment with backend.
- Verify live place search availability and Google API configuration on the release build.
- Verify road-route failure/recovery on device. Straight-line road fallback has been removed; unavailable previews retain pins with an explanation.
- Verify continuous pinch transitions and fit behavior for international routes, including date-line routes.
- Verify location permission denial, GPS failure, retry, offline recovery and process restart.
- Active booking form restoration after process restart remains incomplete; saved draft summaries are not equivalent to persisted form data.
- Verify payment journey and invoice reconciliation after booking.
- iOS device testing and release API-key restrictions remain pending.

No new live shipment or payment was submitted during this assessment.

## Local booking UX review ? current pass

Reviewed route, cargo, contacts, schedule, review, and shared map/search code. Android inspection covered route entry and map picker; this is not an exhaustive end-to-end pass.

Fixed:
- Removed duplicate pickup/delivery detail and area forms; they could also discard coordinates.
- Replaced manual-entry action with Use map and direct pin selection. Cancellation preserves the existing stop; confirmation requires a resolved address in the detected city.
- Suppressed raw Plus Codes from native reverse geocoding. Prefer street/place names, otherwise use Current location or Selected location with the available area/city; never invent a nearby business name.
- Replaced misleading empty-search error before typing with guidance. Search close now dismisses the keyboard; map selection dismisses it too.
- Review now displays selected addresses instead of only city/area names.
- Removed empty saved-recipient heading. Corrected pickup timing copy that promised an unimplemented time window.
- Stabilized map coordinate props to avoid requesting directions on unrelated screen renders.
- Removed invented straight-line road previews after directions failures.

Remaining risks / follow-up, ordered by customer impact:
- High: form recovery after process termination remains incomplete.
- High: real submission, ambiguous network retries, payment and invoice reconciliation require a controlled end-to-end journey.
- Medium: city matching relies on geocoder locality names, not authoritative service polygons. Boundary neighborhoods and locality aliases need device/backend coverage tests.
- Medium: native geocoding may provide only an area/city. The readable fallback is honest but not a precise landmark; customer delivery instructions remain available on contacts.
- Medium: nearly identical pickup/destination points can produce a quote and overlap visually. Minimum-distance policy needs to match backend operations.
- Medium: verify cargo capacity versus vehicle selection after cargo edits; route screen capacities alone are not proof of server validation.
- Medium: test long addresses, large fonts, keyboard/back behavior, GPS denial, unavailable geocoding, and cancellation across both platforms.
- Medium: scheduled pickup currently represents a preference; there is no selectable guaranteed time slot.
- Low: some price metadata still uses technical language and missing distance/ETA placeholders.

Validation this pass: TypeScript passed; 13 focused tests passed (place labels, city restrictions, configured search, pricing). Android showed a readable GPS pickup and the simplified two-stop route card. A live price appeared after map selection; no shipment was submitted by the agent.

## Branded live-map pass
- Added shared yellow/navy custom pins for pickup, destination, current location, selected location and offices. Vehicle asset exists, but shipment contract has no live driver coordinate field to render truthfully.
- Shared warm neutral map styling with yellow highways and solid yellow road polyline.
- Picker uses a fixed centre overlay. Region completion triggers debounced reverse geocoding; movement invalidates old results and disables confirmation. Timeout/retry and city validation retained.
- Android screenshots verified centred pin, themed picker and resolved address with Confirm location enabled after movement.
- Fixed road request payload to send latitude/longitude only (map labels must not be included in Google latLng).
- Seven focused map/geocoding tests passed; TypeScript and lint passed.
- Live road route remains unverified: no EXPO_PUBLIC_GOOGLE_MAPS_API_KEY found in local .env/.env.local. Asked user where the key is configured. Expo Go base tiles do not establish Routes/Places API access.

## Inline phone contact selection
- Reusable right-hand contact action in booking phone fields, retaining manual input.
- Applied to local sender/receiver, intercity sender/receiver and international consignee; fills matching name and phone together.
- Removed the separate receiver-only contact button.
- Cancellation preserves inputs; denial, missing phone and native failures use shared feedback. International prefixes preserved.
- Android sender icon opened the native picker; cancelled without selecting a personal contact. TypeScript and lint passed. Actual contact autofill and iOS remain device checks.

## Booking contact defaults
- City-to-City sender and International receiver default from the authenticated profile only when no contact object exists. Editing, clearing and replacing a contact remain available.
- Matching profile details show Me (editable). Sender and Receiver sections are explicit.
- International supplier contact details are optional and appear in review only when supplied. Contact picker and suggestions apply to supplier name/phone.
- Payload keeps supplier details separate; absent overseas sender is blank instead of copying receiver phone. Backend handling of optional supplier metadata still needs live verification.
- Android International receiver default and enabled continuation with empty supplier verified. Eight focused tests and TypeScript passed. Lint has no errors; existing unrelated warnings remain.

## Minimal booking inputs
- Shared booking FormField now uses its field name as placeholder, retaining accessibility labels and contact controls. Section titles remain visible.
- Route entry no longer repeats a label above each selected location; empty fields identify pickup/delivery (or configured office role).
- Cargo description is placeholder-led; quantity retains inline context for its prefilled value. Single item no longer shows an unnecessary item number/remove row.
- Optional cargo notes/photos/documents are progressively disclosed, pre-opened when data exists on mount. Supplier and delivery instructions remain optional sections.
- Android cargo layout visually checked. TypeScript passed; shared component lint checked. No booking data requirements or server validation removed.

## Global mobile input design
- Audited all native TextInput sites in app/components.
- Added shared MobileInput: 56dp minimum frame, 16dp corners, consistent padding/type/focus/error treatment, placeholder-first empty state, small in-field label for filled ambiguous values, inline actions.
- Adopted by authentication/passwords, profile settings, saved directory entries, saved-place naming, booking fields and shipment instruction editor.
- Shared typography/frame styling applied to location search, invoice/shipment search, tracking lookup/scan, tracking instructions and cargo inputs. Removed duplicate tracking label; retained OTP group and financial/status context.
- Native profile editor visually checked on Android; no profile changes submitted. TypeScript and changed-file lint pass. Full iOS/large-font and each-modal visual sweep remain pending.

## Branded shipment ticket summaries
- Added reusable navy/yellow ShipmentTicket with route markers, shipment type/status, dashed section divider, sender/receiver, cargo strip, optional weight and attachments. Optional real reference supported; no invented tracking number.
- Local, City-to-City and International review screens now use full-page ShipmentReviewScreen with a fixed bottom action instead of a map drawer. Route/contact/cargo edits preserved and collection/method/timing edits retained.
- Separate price summary shows server quote or pending/unavailable states. No invented insurance, fees, delivery ETA or paid status. Final itemized charge contract remains pending.
- TypeScript and changed-file lint pass. Android visual review of new summary still pending: current phone screen has an active profile drawer. No shipment submitted.

## Compact pickup scheduling
- Removed the separate Local Delivery scheduling step; contacts now continue directly to review. Legacy schedule links redirect to review.
- Review includes a Schedule pickup switch. Enabling it opens a branded bottom sheet with today/current device time preselected, date/time selectors and Save pickup time. Disabling restores earliest available and clears the timestamp.
- Scheduled timestamp flows into quote requests, submission form and confirmation display. Current-minute/future validation rejects past times. Exact-time backend acceptance/persistence remains unverified; this is a pickup request, not a guaranteed slot.
- Expo SDK 54 date/time picker installed and config plugin added. TypeScript and changed-file lint passed; 11 focused tests passed.
- Android review/sheet visual check remains pending: incomplete current booking redirects to cargo entry. No user draft filled or live shipment submitted for this check.

## Shared skeleton loading and startup cache
- Added reusable reduced-motion-aware skeletons for shipment/list cards, invoices, profile, tracking, quote and map containers. Integrated cold loading across Home, Shipments, shipment/order/return/pickup details, tracking search, saved directories, notification preferences, support, billing/payment/receipts/wallet and booking location search. Existing content remains during background requests; action buttons retain their separate submission feedback.
- Replaced Home's static SVG delivery illustration with the real branded native map. API address coordinates now survive domain-to-UI mapping. Shared map has independent loading fade and a timed retry state. Home does not request location permission or invent shipment coordinates. Android Home verified with live tiles; current shipment response lacks coordinates so unavailable-location copy is shown.
- Added an account-and-environment scoped TanStack Query client. Profile, shipments and notification prefetch start after authentication; places, recipients, billing, payment methods and booking reference data follow without awaiting navigation. Home and shipment screens share the same request/cache. No separate dashboard endpoint was invented.
- Common data hydrates from a scoped local cache (24-hour maximum disk age), while new network results take priority. Read policies use 15-30 seconds for dynamic shipments/tracking and up to five minutes for reference/contact data. Focus/reconnect refresh quietly. Logout clears persisted cache and account changes replace the client; late responses cannot enter the next account. Payment credentials are not persisted.
- Added mutation invalidation for bookings/billing and shared updates for saved directories, support, profile and notifications. Cached empty arrays are valid results. Missing connectivity without cached content presents an error/retry state instead of endless loading.
- Fixed cold invoice detail/receipt crashes and removed fallback to an unrelated first invoice; unpaid invoices cannot display a paid receipt. Billing errors no longer silently appear as a paid-up zero balance.
- Validation: TypeScript passes; targeted ESLint passes; 17 focused cache, route-reference and Laravel contract tests pass. Android Home map visually checked. Full iOS, every-screen skeleton visual audit, real network-throttling timing and road-polyline verification remain pending. No live booking/payment was submitted.
- Implementation reference: https://tanstack.com/query/latest/docs/framework/react/guides/prefetching

## Loading consistency follow-up
- Saved places and recipients now use independent loading/error states; one slow endpoint does not hold up the other directory. Failed requests no longer show a misleading empty-directory message.
- Map picker now has an independent map skeleton, fade-in and 15-second retry state. Fixed shared fill skeleton height so it covers the full map container.
- Bills shows a wallet balance skeleton until the wallet response arrives, and unavailable copy on failure rather than an invented zero balance.
- Added Back controls to loading states for shipment, order, tracking, return and pickup screens.
- TypeScript and targeted ESLint passed. New map-picker overlay still needs physical-device/iOS visual verification; no new live transactions submitted.
