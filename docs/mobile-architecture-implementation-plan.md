# New WorldCargo Mobile Architecture Implementation Plan

## Objective

Build the mobile application architecture first, without disturbing production Laravel code.

The mobile app will be designed as the full customer product we want, not only as a reflection of what the current backend exposes today. Laravel remains the eventual system of record, but the mobile architecture should define clean product-level contracts that Laravel can satisfy later.

The mobile app needs its own clean client-side architecture so screens do not talk directly to mock files, raw Laravel responses, or temporary backend limitations.

## Product-First API-Pluggable Principle

The mobile app should be built as if the backend can listen to the product requirements.

That means:

- Build the complete frontend experience first.
- Define mobile-friendly API contracts based on what the app needs.
- Keep mock data realistic and shaped like future API responses.
- Avoid blocking the mobile UX because a Laravel endpoint does not exist yet.
- Keep all backend integration replaceable behind repositories and API clients.
- Never hard-code backend table names or temporary Laravel limitations into screens.
- Treat Laravel as the future adapter target, not the thing that dictates every UI decision today.

The architecture should allow three modes:

| Mode | Purpose |
|---|---|
| `mock` | Build and test the full customer app experience with deterministic local data. |
| `hybrid` | Use Laravel for completed APIs and mock adapters for unfinished APIs. |
| `laravel` | Use Laravel-backed APIs for all production workflows. |

## Target Architecture

```text
Presentation / UI
  -> Navigation
  -> Application / Use Cases
  -> Domain / Business Logic
  -> State Management
  -> Data / Repositories
  -> API / Networking
  -> Backend Adapter
  -> Laravel Backend
```

Supporting layers:

```text
Local Storage / Offline
Device / Native Services
Security
Observability / Analytics
Configuration / Environment
Testing / Quality
Build / Release / CI-CD
```

## Layer Mapping

| Layer | Current State | Target State | Main Work |
|---|---|---|---|
| 1. Presentation / UI | Strong. Screens already exist and are polished. | Keep UI mostly intact. Screens consume use-case hooks instead of mock files. | Remove direct `mock-*` imports from screens gradually. |
| 2. Navigation | Strong. Expo Router routes exist. | Add auth guards, signed-out return paths, deep link routing, and protected route handling. | Centralize route decisions. |
| 3. Application / Use-Case | Partial. Flows exist but logic is often inside screens/stores. | Add use-case modules for login, tracking, shipment list, booking, billing, profile, recipients, saved places. | Create feature use-case hooks and services. |
| 4. Domain / Business Logic | Medium. Helpers exist for booking, tracking, billing, maps, drafts. | Define mobile domain models independent of Laravel table names. | Normalize statuses, money, branch/currency, customer identity, tracking events. |
| 5. State Management | Medium. Context stores exist, many mock-driven. | Keep lightweight state stores, but source data from repositories. | Add loading/error/refresh states per feature. |
| 6. Data / Repository | Weak. Screens and stores import mock data directly. | Repositories become the only place that chooses mock, hybrid, or Laravel adapters. | Add repositories for auth, customer, shipments, tracking, billing, bookings, address book. |
| 7. API / Networking | Scaffolded. Generic API helper exists. | Production-grade mobile API contract layer with Laravel adapter implementation. | Add typed endpoint clients, consistent errors, and response mapping. |
| 8. Local Storage / Offline | Basic. Session and drafts exist. | Secure session storage, persisted drafts, cache snapshots, retry queue for safe actions. | Add storage keys, migrations, offline status, stale-data labels. |
| 9. Device / Native Services | Mostly mock. QR, maps, notifications, files are prepared. | Adapter-based native services with browser-safe fallbacks. | Add camera, push, sharing, files, maps, location adapters later. |
| 10. Security | Basic. Secure Store dependency exists. | Token lifecycle, refresh, logout cleanup, PII rules, secure storage boundary. | Implement auth session manager and protected request handling. |
| 11. Observability / Analytics | Missing. | Error reporting, API failure logs, workflow analytics, release diagnostics. | Add event/error interface before choosing provider. |
| 12. Configuration / Environment | Medium. Expo config and env keys exist. | Clean dev/staging/prod env contract, real app identifiers, feature flags. | Add typed env module and build profiles. |
| 13. Testing / Quality | Good frontend logic tests. | Add repository tests, API mapper tests, auth/session tests, workflow tests. | Keep Vitest; later add E2E smoke flows. |
| 14. Build / Release / CI-CD | Weak. Scripts exist but no visible CI/EAS pipeline. | Repeatable preview, staging, production builds. | Add EAS config and GitHub Actions after architecture stabilizes. |

## Proposed Folder Structure

```text
app/
components/
lib/
  api/
    client.ts
    errors.ts
    endpoints/
      auth-api.ts
      customer-api.ts
      shipments-api.ts
      tracking-api.ts
      billing-api.ts
      bookings-api.ts
      address-book-api.ts
  config/
    env.ts
    feature-flags.ts
  domain/
    auth.ts
    customer.ts
    shipment.ts
    tracking.ts
    billing.ts
    booking.ts
    branch.ts
    money.ts
  repositories/
    repository-mode.ts
    auth-repository.ts
    customer-repository.ts
    shipment-repository.ts
    tracking-repository.ts
    billing-repository.ts
    booking-repository.ts
    address-book-repository.ts
  adapters/
    mock/
      mock-auth-adapter.ts
      mock-shipment-adapter.ts
      mock-tracking-adapter.ts
      mock-billing-adapter.ts
      mock-booking-adapter.ts
      mock-address-book-adapter.ts
    laravel/
      laravel-auth-adapter.ts
      laravel-shipment-adapter.ts
      laravel-tracking-adapter.ts
      laravel-billing-adapter.ts
      laravel-booking-adapter.ts
      laravel-address-book-adapter.ts
  use-cases/
    use-auth-session.ts
    use-customer-profile.ts
    use-customer-shipments.ts
    use-public-tracking.ts
    use-customer-billing.ts
    use-booking-drafts.ts
  storage/
    secure-session-storage.ts
    draft-storage.ts
    cache-storage.ts
  services/
    device/
      camera-service.ts
      location-service.ts
      notification-service.ts
      share-service.ts
    observability/
      analytics.ts
      error-reporter.ts
stores/
tests/
```

## Implementation Phases

### Phase 1: Architecture Foundation

Goal: Create the architecture skeleton while preserving current UI behavior and making every feature API-pluggable.

Tasks:

- Add typed environment module.
- Add feature flags for `mock` vs `laravel`.
- Add API client wrapper with timeout, JSON handling, auth headers, and Laravel error normalization.
- Add domain model files for customer, shipment, tracking, billing, booking, branch, and money.
- Add repository interfaces and mock-backed implementations.
- Add adapter mode selection for `mock`, `hybrid`, and `laravel`.
- Add use-case hooks that screens can consume.

Acceptance criteria:

- Existing screens still work with mock data.
- Screens can begin importing from use cases instead of mock files.
- Mobile product contracts are defined independently from Laravel table names.
- No Laravel production code is changed.

### Phase 2: Auth And Session Architecture

Goal: Prepare real customer login without breaking current mock login.

Tasks:

- Add `AuthRepository`.
- Add `AuthSessionManager`.
- Support login by email/phone plus password.
- Support session restore.
- Support logout cleanup.
- Add disabled placeholder for refresh-token flow until Laravel endpoint is confirmed.
- Map Laravel customer profile response into mobile `CustomerProfile`.

Acceptance criteria:

- Login UI calls auth use case, not local placeholder creation.
- Mock auth remains available by feature flag.
- Real API mode can call Laravel when endpoint details are ready.

### Phase 3: Customer Data Repositories

Goal: Stop screens from depending directly on mock business data.

Tasks:

- Add shipment repository.
- Add tracking repository.
- Add billing repository.
- Add booking repository.
- Add saved places and recipients repository.
- Keep mock implementations behind the repository layer.
- Add mapper tests for each repository.

Acceptance criteria:

- Home, Shipments, Tracking, Bills, Account can read through repositories.
- Mock files become data sources, not screen dependencies.

### Phase 4: Laravel API Wiring

Goal: Connect real Laravel data one workflow at a time after the mobile contracts are stable.

Order:

1. Auth and `/me`.
2. Customer shipments list.
3. Shipment detail.
4. Public/private tracking and tracking history.
5. Invoices and receipts.
6. Saved recipients and saved places.
7. Booking drafts and booking submission.
8. Payments and payment status.

Acceptance criteria:

- Each workflow can be switched between mock and Laravel mode.
- Laravel response shapes are mapped into mobile domain models before reaching screens.
- API errors show customer-safe messages.
- `401` sends user to login with return path.
- `403` explains access clearly.
- `422` maps field errors into forms.
- `500` shows recoverable support-friendly error state.

### Phase 5: Offline And Resilience

Goal: Make the app usable under weak network and expired sessions.

Tasks:

- Persist customer session securely.
- Persist draft bookings.
- Cache latest shipments, tracking, invoices, recipients.
- Add retry states for read-only requests.
- Add safe queue only for idempotent actions or explicitly confirmed actions.

Acceptance criteria:

- User is not randomly thrown out during ordinary app usage.
- Expired sessions route clearly to login.
- Drafts survive app restart.
- Cached data is visibly marked when stale.

### Phase 6: Device Services

Goal: Add native capabilities through adapters, not direct screen logic.

Tasks:

- QR scan adapter.
- Push notification adapter.
- Location/map adapter.
- File download/share adapter.
- Photo/document upload adapter.

Acceptance criteria:

- Browser preview continues to work.
- Native device behavior is isolated behind service modules.
- Permissions are requested only at the moment they are needed.

### Phase 7: Observability And Security Hardening

Goal: Make production issues diagnosable and sensitive data safer.

Tasks:

- Add app event tracking interface.
- Add error reporting interface.
- Track login, logout, tracking search, booking draft, booking submit, invoice view, payment attempt, payment result.
- Redact phone numbers, tokens, addresses, and payment data from logs.
- Add token/session cleanup on logout and failed auth restore.

Acceptance criteria:

- Failures can be traced without leaking private customer data.
- Production logs do not include raw tokens or full PII.

### Phase 8: Build And Release

Goal: Prepare repeatable mobile releases.

Tasks:

- Add EAS config.
- Add app identifiers for iOS and Android.
- Add preview/staging/production profiles.
- Add GitHub Actions for install, typecheck, tests, lint, and build preview.
- Add release checklist.

Acceptance criteria:

- A developer can build the app without guessing commands.
- CI catches type/test/lint failures before release.
- Environment selection is explicit.

## Full Mobile Completion Backlog

This is the practical build checklist for finishing the mobile app as a complete product shell before deep Laravel wiring.

### 1. Presentation / UI Layer

Scope:

- Home
- Shipments
- Shipment detail
- Live tracking
- Public tracking
- Send cargo
- Local delivery booking
- International import booking
- City-to-city booking
- Custom request
- Drafts
- Bills
- Invoice detail
- Payment
- Wallet
- Receipts
- Account
- Profile
- Security
- Saved places
- Recipients
- Notifications
- Permissions
- Support
- Legal
- System states

Finish requirements:

- Every visible action opens a real screen, sheet, modal, or disabled state with clear reason.
- Every form has labels, validation, loading, empty, error, success, and disabled states.
- Every list has loading, empty, error, filtered-empty, and pagination or incremental loading treatment.
- Every workflow has confirmation and recovery states.
- Every screen follows the shared mobile layout primitives.
- No unfinished mock-only labels should appear in customer-facing production mode.

### 2. Navigation Layer

Finish requirements:

- Protected routes redirect to login.
- Signed-out users return to their original destination after login.
- Public routes work without login where appropriate, especially tracking.
- Deep links resolve for tracking, invoices, receipts, bookings, support cases, and password recovery.
- Expired links show a proper recovery screen.
- Unknown routes show a useful not-found screen.
- Hardware back behavior is predictable on Android.
- Modal/sheet routes close cleanly.

### 3. Application / Use-Case Layer

Required use cases:

- `signIn`
- `registerCustomer`
- `verifyOtp`
- `requestPasswordReset`
- `resetPassword`
- `restoreSession`
- `signOut`
- `loadHomeOverview`
- `loadCustomerShipments`
- `loadShipmentDetail`
- `trackShipmentByCode`
- `createBookingDraft`
- `updateBookingDraft`
- `submitBooking`
- `loadInvoices`
- `payInvoice`
- `downloadReceipt`
- `manageSavedPlace`
- `manageRecipient`
- `updateProfile`
- `uploadProfilePhoto`
- `updateNotificationPreference`
- `submitSupportCase`
- `attachSupportEvidence`

Finish requirements:

- Screens call use cases, not repositories directly.
- Use cases expose `idle`, `loading`, `success`, `empty`, `error`, and `refreshing` states.
- Use cases map technical failures into customer-safe messages.

### 4. Domain / Business Logic Layer

Domain models needed:

- Customer
- Customer session
- Branch
- Currency / money
- Shipment
- Consignment
- Tracking event
- Booking draft
- Booking quote
- Invoice
- Receipt
- Payment method
- Wallet transaction
- Saved place
- Recipient
- Support case
- Notification preference
- Permission state
- Device/session activity

Finish requirements:

- Status labels are normalized for mobile.
- Money display supports branch/customer/location currency rules.
- Tracking stages support both local and international shipments.
- Booking rules are service-specific.
- Domain models do not expose database table names.

### 5. State Management Layer

Stores needed:

- Auth/session store
- Home overview store
- Shipment store
- Tracking store
- Booking draft store
- Billing store
- Wallet/payment store
- Account directory store
- Notification store
- Permission store
- Support store
- App startup/system state store

Finish requirements:

- Stores own UI state and cache state only.
- Stores do not hard-code mock arrays.
- Stores can hydrate from local storage.
- Stores can refresh from repositories.
- Stores clear sensitive data on logout.

### 6. Data / Repository Layer

Repositories needed:

- Auth repository
- Customer repository
- Shipment repository
- Tracking repository
- Booking repository
- Billing repository
- Wallet repository
- Address-book repository
- Support repository
- Notification repository
- Upload/document repository

Finish requirements:

- Each repository has mock and Laravel adapter implementations.
- Repositories return mobile domain models only.
- Repository mode can be switched by environment.
- Hybrid mode can use Laravel for one feature and mock for another.
- Screens never import `lib/mock-*` directly.

### 7. API / Networking Layer

Finish requirements:

- Central API client.
- Request timeout.
- Retry policy for safe reads.
- Auth header/session attachment.
- Refresh-token hook.
- File upload support.
- File download support.
- Query param builder.
- Laravel error normalization for `400`, `401`, `403`, `404`, `409`, `422`, `429`, `500`.
- Network unavailable detection.
- Request IDs preserved for support.
- PII and token-safe logging.

### 8. Local Storage / Offline Layer

Finish requirements:

- Secure token/session storage.
- Persisted booking drafts.
- Cached shipment list/detail.
- Cached tracking result.
- Cached invoices/receipts.
- Cached saved places/recipients.
- Storage versioning and migration.
- Logout cleanup.
- Offline banner/state.
- Retry queue for safe draft/profile/support actions only.

### 9. Device / Native Services Layer

Services needed:

- Camera / QR scanner.
- Location permission.
- Current location.
- Map provider adapter.
- Push notification registration.
- Local notification fallback.
- File picker.
- Image picker.
- Profile-photo capture/upload.
- Document sharing.
- Receipt/proof download.
- Haptics.
- Biometric unlock.
- App update/version check.

Finish requirements:

- Each native service has browser-safe fallback.
- Permissions are requested only when needed.
- Denied permission states include manual alternatives.
- Native services are not called directly from screens.

### 10. Security Layer

Finish requirements:

- Session token is stored securely.
- Refresh lifecycle is centralized.
- Logout clears all sensitive data.
- Expired session redirects cleanly.
- Biometric app unlock can be enabled later without rewriting auth.
- PII is redacted from logs.
- Customer data exports and deletion requests have confirmation states.
- Uploads validate file type and size before sending.
- Public tracking is rate-limit friendly.

### 11. Observability / Analytics Layer

Events needed:

- App opened.
- Session restored.
- Login attempted.
- Login failed.
- Shipment list opened.
- Tracking search submitted.
- Booking draft created.
- Booking submitted.
- Invoice opened.
- Payment attempted.
- Payment completed.
- Support case submitted.
- API error occurred.
- Native permission denied.

Finish requirements:

- Analytics interface exists before provider selection.
- Error reporter interface exists before provider selection.
- Request ID, route name, workflow, and feature mode are captured.
- PII is redacted.
- Observability can be disabled in development.

### 12. Configuration / Environment Layer

Environments:

- `development`
- `staging`
- `production`

Config needed:

- API mode: `mock`, `hybrid`, `laravel`.
- API base URL.
- Public tracking base URL.
- App scheme.
- iOS bundle ID.
- Android package ID.
- Feature flags.
- Build profile.
- Observability DSN.
- Payment provider mode.
- Maps provider mode.

Finish requirements:

- Missing required production env fails clearly.
- Development can run with mock data.
- Staging can run hybrid.
- Production cannot accidentally use mock-only customer data.

### 13. Testing / Quality Layer

Tests needed:

- Domain model mapping.
- Repository mock adapters.
- Laravel response mappers.
- Auth/session restore.
- Route guards.
- Booking validation.
- Tracking lookup.
- Billing/payment states.
- Offline/cache behavior.
- Permission denied flows.
- Storage migration.
- Error normalization.

Quality checks:

- TypeScript strict check.
- Lint.
- Unit tests.
- Key workflow smoke tests.
- Manual physical-device checklist.

Finish requirements:

- Every new architecture layer has at least focused unit coverage.
- Critical customer flows have deterministic tests.
- Release branch cannot skip typecheck/test/lint.

### 14. Build / Release / CI-CD Layer

Finish requirements:

- EAS config exists.
- Preview/staging/production profiles exist.
- Android package ID is final.
- iOS bundle ID is final.
- App icon/splash assets are final.
- GitHub Actions run install, typecheck, lint, and tests.
- Release checklist exists.
- Versioning policy exists.
- Environment-specific builds are documented.

## Mobile App Completion Definition

The mobile app is "frontend ready" when:

- All customer screens and visible actions are complete.
- All state and use-case layers are wired.
- All data access goes through repositories.
- Mock, hybrid, and Laravel adapter modes exist.
- Local storage and offline behavior are present.
- Native services have adapters and browser-safe fallbacks.
- Security and session handling are centralized.
- Observability interfaces exist.
- Config and environments are explicit.
- Tests cover critical flows and architecture boundaries.
- Build and release pipeline is prepared.

Only after this point should Laravel integration become the main workstream.

## Feature Milestone Roadmap

This roadmap breaks the full mobile app into buildable milestones. Each milestone should leave the app more usable, not just more coded.

### Milestone 0: Product Shell And Architecture Spine

Goal:

Make the mobile app structurally ready for all other features.

Status:

Initial architecture spine created. The app now has typed config, feature flags, API client/error handling, domain models, repository contracts, mock adapters, Laravel adapter placeholders, storage helpers, observability interfaces, device-service stubs, and first use-case hooks.

Features:

- App startup flow.
- Auth guard.
- Route return handling.
- Environment config.
- Feature flags.
- Repository mode selector.
- API client shell.
- Shared loading, empty, error, offline, and success states.
- Shared form validation helpers.
- Shared document/action confirmation pattern.

Done when:

- The app can run in `mock`, `hybrid`, or `laravel` mode.
- Screens can call use cases instead of importing mock data.
- Expired or missing sessions route predictably.
- No feature needs to invent its own loading/error pattern.

### Milestone 1: Customer Auth And Account Identity

Goal:

Make login, registration, recovery, profile, and session behavior complete in the app.

Status:

Implemented in the mobile architecture spine. The auth repository covers sign-in, registration, OTP verification, OTP resend, password reset request, password reset confirmation, signed-in password change, session restore, and logout. Existing auth screens now use this repository boundary while preserving the current UI. Customer profile updates and profile-photo uploads have repository/use-case boundaries with mock and Laravel adapters. Session snapshots preserve customer avatar, branch, and portal-eligibility metadata, while native API tokens are stored and removed through the secure token boundary.

Features:

- Email/phone sign-in.
- Password sign-in.
- OTP verification screens.
- Customer registration.
- Forgot password.
- New password setup.
- Session restore.
- Logout.
- Remember me.
- Profile details.
- Profile photo UI.
- Password change from account settings.
- Account eligibility state.
- Session expired state.

Done when:

- A customer can enter, leave, restore, and recover the app cleanly.
- Auth works in mock mode through the same interfaces Laravel will later use.
- Every auth error has a customer-safe message.

### Milestone 2: Home And Customer Dashboard

Goal:

Make the app open into a useful cargo desk, not a static landing screen.

Features:

- Greeting based on real/local profile.
- Active shipment summary.
- Shipment quick tracking.
- Send cargo shortcuts.
- Outstanding invoice summary.
- Draft booking continuation.
- Recent shipments.
- Notification entry.
- Support entry.

Status:

Partially implemented on the architecture spine. Home now reads active and recent shipments through the customer shipment use-case instead of direct mock shipment imports, and it includes loading, empty, error, and retry states for the shipment panels.

Done when:

- Home reflects the current customer state.
- Empty customer, active customer, unpaid invoice, draft booking, and no-network states all look intentional.
- Every Home action routes somewhere complete.

### Milestone 3: Shipments And Orders

Goal:

Make customers able to view and manage their cargo lifecycle.

Features:

- Shipment list.
- Search.
- Filters.
- Shipment detail.
- Order detail.
- Shipment status timeline.
- Delivery summary.
- Proof of delivery.
- Post-booking management.
- Delivery instructions.
- Reschedule request.
- Cancellation eligibility.
- Return request.

Done when:

- A customer can understand what they have, where it is, and what they can do next.
- Active, pending, delivered, cancelled, exception, and return-eligible states are complete.

### Milestone 4: Tracking

Goal:

Make tracking reliable and useful both signed in and public.

Features:

- Public tracking entry.
- Signed-in tracking.
- QR scan fallback.
- Manual code entry.
- Recent tracking codes.
- Tracking result screen.
- Not-found state.
- Temporarily-unavailable state.
- International milestone timeline.
- Local delivery live tracking.
- Share tracking result.

Status:

Partially implemented on the architecture spine. The scan/manual tracking entry now uses the public tracking use-case. Active tracking and completed shipment detail screens fetch shipment records through the single-shipment repository/use-case boundary and show explicit loading, not-found, error, and retry states instead of silently falling back to bundled data.

Order details, delivery-management, and return-request screens also read through the single-shipment use-case, so customer-facing shipment action screens no longer silently substitute a different bundled shipment when the requested record is missing.

Return requests now have a mobile domain model, repository contract, mock and Laravel adapters, and a return-request use-case. The return journey submits through this use-case and rehydrates existing submitted requests from the repository boundary.

Pickup management now has a mobile domain model, repository contract, mock and Laravel adapters, and a pickup-management use-case. The pickup screen no longer falls back to another shipment’s bundled pickup when the requested shipment has no pickup action; it shows an explicit loading, unavailable, or retry state instead.

Done when:

- Known and unknown tracking codes both produce clear outcomes.
- Tracking can show local, intercity, and international cargo correctly.
- Tracking history UI is complete even before Laravel is wired.

### Milestone 5: Send Cargo And Booking

Goal:

Make booking a shipment feel complete and recoverable.

Features:

- Service selection.
- Local delivery flow.
- International import flow.
- City-to-city flow.
- Custom request flow.
- Route entry.
- Branch/city/country suggestions.
- Saved place autofill.
- Recipient autofill.
- Cargo details.
- Contact details.
- Schedule/pickup preferences.
- Quote preview.
- Review screen.
- Save draft.
- Resume draft.
- Delete draft.
- Submit booking.
- Booking confirmation.

Status:

Partially implemented on the architecture spine. Review screens for Local Delivery, International Imports, City-to-City, and Custom Request now submit through the booking submission use-case before navigating to confirmation. Mock and Laravel booking adapters share the same mobile submission contract.

Done when:

- A customer can start, pause, resume, edit, and submit each booking type.
- Drafts survive app restart.
- Required fields and validation are clear.

### Milestone 6: Billing, Wallet, Payments, And Receipts

Goal:

Make customers able to understand and act on money-related records.

Features:

- Invoice list.
- Invoice filters.
- Invoice detail.
- Outstanding balance.
- Payment method selection.
- Cargo Wallet.
- Wallet top-up UI.
- Payment states: ready, processing, success, failed, cancelled, delayed.
- Paid receipt history.
- Receipt detail.
- Receipt download/share.
- Refund/dispute state.
- Payment support case entry.

Status:

Partially implemented on the architecture spine. The billing domain now includes invoice detail fields, line items, payment method, resolution timeline, and currency display information. The existing Bills/payment store hydrates once through the billing repository so Laravel invoices can plug in later without breaking local wallet/payment state during the frontend phase.

Billing write-actions now also have repository contracts with mock and Laravel adapters. Saved payment methods, default method changes, method removal, wallet top-ups, invoice payment confirmation, reminders, and charge disputes route through `billingActions` while the existing customer UI remains stable.

Done when:

- Customers can see what they owe, what they paid, and what happened.
- Payment UI is complete in mock mode and provider-ready later.
- Receipts export in browser-safe mode and native-ready mode.

### Milestone 7: Account, Directories, Preferences, And Support

Goal:

Make self-service complete.

Features:

- Account overview.
- Profile details.
- Profile photo management.
- Saved places.
- Recipients.
- Payment methods.
- Notification preferences.
- Security settings.
- Recognized devices.
- Data export request.
- Account deletion request.
- Legal/policy screens.
- Support case list.
- Support case detail.
- Support case creation.
- Evidence attachment UI.

Status:

Partially implemented on the architecture spine. Saved places and recipients now have repository contracts, mock and Laravel adapters, create/update/delete methods, deterministic tests, and a shared address-book use-case. The Account directory screen, Local Delivery saved recipients, and Local Delivery saved places now read and mutate through that use-case instead of depending directly on bundled mock data. Address-book item/kind types now live in the mobile domain layer, while bundled directory records remain only mock adapter sample data.

Support cases also now have a mobile domain model, repository contract, mock and Laravel adapters, shared use-case, and deterministic repository tests. The Support screen and invoice charge-review action create/list support cases through the repository boundary while keeping the current frontend experience intact.

Account settings now have a mobile domain model, repository contract, mock and Laravel adapters, and an account-settings use-case. Recognized devices, marketing preference, data export request, and account deletion request now flow through that boundary, and the screen no longer depends on the mock settings provider.

Done when:

- Account is not a menu of dead ends.
- Every settings action has a complete flow, disabled explanation, or confirmation.

### Milestone 8: Local Storage, Offline, And Resilience

Goal:

Make the app feel stable under weak network, app restarts, and expired sessions.

Features:

- Secure session persistence.
- Persisted drafts.
- Cached shipments.
- Cached invoices.
- Cached tracking result.
- Cached account directory.
- Offline banner.
- Retry reads.
- Stale data labels.
- Logout cleanup.
- Storage migration.

Done when:

- The app does not collapse when internet is poor.
- Customers can recover from network and session problems without losing progress.

Status:

Partially implemented on the architecture spine. JSON storage now uses browser `localStorage` on web and native AsyncStorage on mobile devices, while secure session records continue through Expo SecureStore. Shipment and billing reads now save successful repository responses into cache and can show the last saved snapshot with a stale-data notice when a later API or network request fails. Public tracking lookup also stores previously found tracking-code results by normalized code, so repeated lookups can recover from a temporary tracking API failure. Saved places and recipients now persist through the address-book storage seam and can fall back to the last saved directory snapshot.

### Milestone 9: Native Services

Goal:

Make mobile-only capabilities ready behind clean adapters.

Features:

- Camera QR scanner.
- Image picker.
- File picker.
- Profile photo capture/upload.
- Location permission.
- Current location.
- Map provider adapter.
- Push notification registration.
- Local notifications.
- Native sharing.
- File download/save.
- Haptics.
- Biometric unlock.

Status:

Partially implemented on the architecture spine. Customer permission education and status labels now live in the mobile permission domain. Permission list/detail screens and address search consume a shared customer-permission provider, which keeps browser-preview behavior stable while routing future camera, location, notification, photo, contact, and biometric requests through the native permission-service boundary.

Native services now return structured `NativeServiceResult` values across camera/QR, photo picking, document picking, file saving, current location, map route preview, push/local notifications, native sharing, haptics, and biometric unlock. QR scan, profile-photo selection, support evidence attachment, tracking share, and tab haptics now call those service seams, so browser preview remains safe while native modules can be attached later without rewriting screens.

Done when:

- Screens use service adapters, not raw native APIs.
- Browser preview still works.
- Permission-denied and manual alternatives are complete.

### Milestone 10: Security And Observability

Goal:

Make production behavior safer and diagnosable.

Features:

- Token redaction.
- PII-safe logs.
- Central error reporting interface.
- Analytics interface.
- Request ID capture.
- API failure capture.
- Auth event capture.
- Payment event capture.
- Booking event capture.
- Permission-denied capture.
- Crash reporting provider hook.

Done when:

- We can understand failures without exposing private customer data.
- Production logging behavior is deliberate.

Status:

Partially implemented on the architecture spine. Analytics and error reporting now share a redaction utility that masks sensitive keys and sensitive text values before anything is logged. Mobile API errors carry request IDs where the backend provides them, and the error reporter includes that request ID without exposing request payloads. Legacy auth-core debug logs that printed token fragments and full user objects have been removed.

### Milestone 11: Testing And Quality Gate

Goal:

Make quality repeatable instead of manual memory.

Features:

- Unit tests for domain logic.
- Repository adapter tests.
- API mapper tests.
- Store tests.
- Auth/session tests.
- Booking flow tests.
- Billing flow tests.
- Tracking flow tests.
- Offline/storage tests.
- Permission flow tests.
- Manual physical-device checklist.

Done when:

- Every architecture layer has focused test coverage.
- Core customer flows have deterministic tests.
- Release cannot skip quality checks.

Status:

Partially implemented on the architecture spine. The repo now has a local `pnpm quality` gate that runs TypeScript and the deterministic Vitest suite in one command. This provides a repeatable local release check while the GitHub Actions workflow remains blocked by the current GitHub OAuth token lacking `workflow` scope.

### Milestone 12: Build, Release, And Store Readiness

Goal:

Make the app installable and releasable.

Features:

- Final app name.
- Final app icon.
- Final splash.
- Final scheme.
- Android package ID.
- iOS bundle ID.
- EAS build config.
- Preview build profile.
- Staging build profile.
- Production build profile.
- GitHub Actions.
- Versioning policy.
- Release checklist.
- Store metadata checklist.

Done when:

- We can produce a preview build.
- We can produce a staging build.
- We have a clear route to Android/iOS production release.

Status:

Partially implemented on the architecture spine. The Expo config now uses product-ready New WorldCargo defaults for app name, slug, scheme, iOS bundle ID, and Android package ID, with environment-variable overrides for future white-label or staging changes. Camera, photo-library, location, and Android permission declarations are present for native review readiness. EAS profiles remain separated for preview/mock, staging/hybrid, and production/Laravel modes, and deterministic release-config tests now protect those defaults.

## Suggested Milestone Order

| Order | Milestone | Why |
|---|---|---|
| 1 | Milestone 0 | Gives every feature the same foundation. |
| 2 | Milestone 1 | Identity controls the rest of the app. |
| 3 | Milestone 2 | Home ties the customer experience together. |
| 4 | Milestone 3 | Shipments are the main customer record. |
| 5 | Milestone 4 | Tracking is the highest-frequency customer action. |
| 6 | Milestone 5 | Booking turns the app into an operational tool. |
| 7 | Milestone 6 | Billing completes customer account value. |
| 8 | Milestone 7 | Account and support complete self-service. |
| 9 | Milestone 8 | Resilience makes it usable in real conditions. |
| 10 | Milestone 9 | Native services deepen the mobile experience. |
| 11 | Milestone 10 | Security and observability prepare production. |
| 12 | Milestone 11 | Testing protects everything built. |
| 13 | Milestone 12 | Release turns it into an installable product. |

## Feature Migration Priority

| Priority | Workflow | Reason |
|---|---|---|
| P0 | Auth/session | Every real customer workflow depends on identity. |
| P0 | Shipments/tracking | Core customer value. |
| P1 | Bills/invoices/receipts | Needed for payment visibility and support. |
| P1 | Recipients/saved places | Needed for better booking UX. |
| P1 | Booking submission/drafts | Converts app from viewer to operational tool. |
| P2 | Payments | Needs careful provider and Laravel contract alignment. |
| P2 | Push notifications | Useful after real shipment/tracking events exist. |
| P2 | Native QR/maps/uploads | Valuable, but should sit behind stable service adapters. |

## Mobile Product API Contract

These contracts describe what the mobile app needs. Laravel can implement these exact routes or provide equivalent routes that the Laravel adapter maps into the same mobile domain models.

The mobile app should not weaken the customer experience just because one backend route is not ready yet.

## Laravel Contract Needed

The mobile app should request or confirm these Laravel API contracts:

- `POST /api/customer/auth/login`
- `POST /api/customer/auth/register`
- `GET /api/customer/auth/me`
- `POST /api/customer/auth/logout`
- `POST /api/customer/auth/refresh`
- `GET /api/customer/shipments`
- `GET /api/customer/shipments/{id}`
- `GET /api/customer/tracking/{code}`
- `GET /api/customer/invoices`
- `GET /api/customer/invoices/{id}`
- `GET /api/customer/receipts/{id}`
- `GET /api/customer/recipients`
- `POST /api/customer/recipients`
- `PUT /api/customer/recipients/{id}`
- `DELETE /api/customer/recipients/{id}`
- `GET /api/customer/saved-places`
- `POST /api/customer/saved-places`
- `PUT /api/customer/saved-places/{id}`
- `DELETE /api/customer/saved-places/{id}`
- `POST /api/customer/bookings`
- `GET /api/customer/bookings/drafts`
- `POST /api/customer/bookings/drafts`
- `PUT /api/customer/bookings/drafts/{id}`
- `DELETE /api/customer/bookings/drafts/{id}`

Endpoint names can change to match Laravel, but the mobile architecture should keep these capabilities separated.

## Data Rules To Preserve

- Laravel is the source of truth.
- Mobile domain models must not expose raw database table shape to screens.
- Consignments and shipments can be shared company knowledge where appropriate.
- Customer app data must remain scoped to the logged-in customer.
- Branch, currency, location, and payment display must come from backend rules.
- Mock data must be clearly isolated and removable.
- No screen should call `fetch` directly.
- No screen should import `lib/mock-*` directly after migration.

## Definition Of Done

The mobile architecture is considered built when:

- Every screen reads data through use cases or repositories.
- Mock data is behind repository implementations only.
- Laravel API clients exist but can be enabled per workflow.
- Auth/session lifecycle is centralized.
- Storage, offline, device services, observability, security, config, tests, and release layers each have a clear module boundary.
- CI/build setup exists for repeatable development and release.
- The app can safely move from frontend prototype to Laravel-backed production app without rewriting screens.
