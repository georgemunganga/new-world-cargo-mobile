# NewWorld Cargo Mobile UAT Results - 2026-09-14

## Environment

- Device: Android SM_X135F via USB/ADB
- Runtime: Expo Go SDK 54.0.8
- Metro URL: `exp://10.210.28.20:8081`
- Backend: local development server on port 3000
- API mode observed: mock/local app data
- Evidence folder: `.uat-screens/`

## Automated Gates

- `pnpm install --frozen-lockfile`: pass after stale Metro/backend processes were stopped
- `pnpm release:audit`: pass
- TypeScript: pass
- Vitest: 51 files passed, 1 skipped; 142 tests passed, 1 skipped

## Physical Android UAT Coverage

| Area | Result | Evidence |
| --- | --- | --- |
| Git pull and dependency sync | Pass | command output |
| Android device connection | Pass | `adb devices` showed SM_X135F |
| App launch in Expo Go | Pass after clearing stale Expo Go cache | `.uat-screens/06-awake-after-clear.png` |
| Onboarding/welcome | Pass | `.uat-screens/06-awake-after-clear.png` |
| Sign-in screen | Pass with issue | `.uat-screens/07-after-continue.png`, `.uat-screens/12-phone-login.png` |
| Invalid sign-in input | Conditional | Invalid email disables Sign in, but no visible inline error message |
| Mock login | Pass | `.uat-screens/13-home.png` |
| Home screen | Pass | active shipment, service cards, recent shipments visible |
| Shipments tab | Pass | `.uat-screens/14-shipments.png` |
| Invoices tab | Pass | `.uat-screens/15-invoices.png` |
| Profile tab | Pass | `.uat-screens/16-profile.png` |
| Book tab | Pass | `.uat-screens/17-book.png` |
| Local Delivery route and quote | Pass | `.uat-screens/18-local-route.png`, `.uat-screens/19-local-saved-places.png`, `.uat-screens/20-local-quote-actions.png` |
| Local Delivery parcel details | Pass | `.uat-screens/21-local-parcel.png` |
| Local Delivery contacts | Conditional | `.uat-screens/22-local-contacts.png`; sender details were not prefilled from profile |
| Local Delivery schedule | Pass | `.uat-screens/23-local-schedule.png` |
| Local Delivery review | Pass | `.uat-screens/24-local-review.png` |
| Local Delivery confirmation/reference | Pass | `.uat-screens/25-local-confirmation.png` |
| New shipment detail from confirmation | Fixed in code | Initial test failed with "Shipment not found"; mock repository now records submitted bookings |
| Expo Go notification warning | Fixed in code | Runtime no longer imports `expo-notifications` in Expo Go after guarded require |

## Fixes Made During UAT

1. Fixed Windows release scripts so `pnpm release:audit` works when Node or pnpm paths contain spaces or when pnpm is an `.exe`.
2. Fixed mock booking submission so a newly submitted booking is also visible through the shipment repository.
3. Added regression coverage proving a submitted booking can be fetched by shipment id.
4. Guarded notification-service loading so Expo Go does not import `expo-notifications` and show the SDK 53+ remote-push limitation error on startup.

## Remaining UAT Blockers

- iOS UAT was not executed because no iOS device/simulator was available in this workspace.
- Production push-notification UAT cannot pass in Expo Go. It requires a development build or release build.
- Live OTP, real payments, real Laravel authorization, real shipment status reconciliation, and push delivery require connected staging/production backend credentials and provider setup.
- Backend started locally but warned `OAUTH_SERVER_URL is not configured`; OAuth flows are not ready in this local environment.
- Android release build was not produced in this run; current validation is Expo Go plus automated release audit.

## Current Overall Result

Conditional pass for local/mock Android UAT coverage completed so far.

Not ready for final production sign-off until development/release builds, iOS, push notifications, live backend auth, payments, and operations status reconciliation are tested.

## Production-Connected Retest

- Runtime: Expo Go, SDK 54
- Device: Samsung SM_X135F via USB/ADB
- Metro: `exp://10.210.28.20:8082`
- Customer API: `https://api.newworldcargo.com/api/v1/`
- Admin API: `https://admin.newworldcargo.com/api/v1/`
- API mode: Laravel only; authentication mocks removed

### Live Error Log

| Severity | Area | Observed error | Evidence and status |
| --- | --- | --- | --- |
| High | Booking pricing | `Pricing is not available for this service in the current environment.` | Reported during the physical-device booking flow. The backend emits this message as HTTP 503 `PRICING_NOT_CONFIGURED` when a required service base rate is missing or non-positive. Mobile now preserves this code, shows a toast, displays a loading spinner, and offers Retry price. Backend production pricing still requires configuration. |
| High | Signed-out startup | Six protected requests were sent without a bearer token and returned HTTP 401: shipment drafts, notification preferences, invoices, payment methods, wallet, and wallet transactions. | Fixed. Root data providers now wait for an authenticated customer. A clean reload produced no protected signed-out requests and no false Session expired redirect. |
| Expected | Authentication | Invalid credentials returned HTTP 401 `UNAUTHENTICATED`: `The supplied credentials are invalid.` | Pass. The app remained on Sign in and displayed `Incorrect email, phone, or password.` through the shared toast. Example production request ID: `a7a35ced-ed5d-42a8-a41c-c1bd6f394143`. |
| Low | Runtime warning | React Native reports that its legacy `SafeAreaView` is deprecated. | Non-blocking. App screens already use `react-native-safe-area-context`; the warning originates from a dependency path and should be rechecked in a development build. |
| Low | Development logging | Theme initialization prints the color-scheme object during reload. | Non-blocking console noise; no customer data was present in the message. |
| Pass | Crash monitoring | No `AndroidRuntime` fatal exception was found in the captured device log. | Continue monitoring during each UAT journey. |

### Pricing Configuration Required

Backend commits `2d5de675` and `2db8850c` replace the earlier environment-only requirement with admin-managed global and route rates. Local Delivery needs a positive global base fee. City-to-City and International Import require an enabled directional branch route with a positive base fee; Import rates are also specific to Air or Sea. Zambia onward delivery is supported by combining the international leg with a configured local or City-to-City leg.

### Pricing Integration Retest

- Production `/api/v1/reference-data` returned five offices and every office had a branch ID and country metadata.
- Mobile quote requests now include `receivingHub`, `onwardDelivery`, `onwardVehicleType`, and cargo `packageType` when applicable.
- The current Import flow treats the selected Zambia receiving branch as `receivingHub` and defaults onward delivery to `collection`.
- City-to-City and Import screens now require backend branch IDs and only display priceable branch suggestions. Import origins are restricted to overseas offices and receiving branches to Zambia.
- `UNSUPPORTED_ROUTE` is preserved as a first-class mobile API error so the backend's useful route message reaches the customer and activity log.
- The accidental fallback that copied the destination branch ID into `pickupBranchId` was removed.
- Automated result: 53 test files passed, 1 skipped; 156 tests passed, 1 skipped. TypeScript passed.
- Physical-device quote success still requires at least one enabled production route for the chosen branch pair and a signed-in customer.
