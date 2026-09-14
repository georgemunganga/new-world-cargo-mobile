# NewWorld Cargo Mobile App — UAT Checklist

## 1. UAT Objective

Confirm that a real customer can use the mobile application successfully for:

- Local pickup and delivery
- City-to-city shipments
- International shipments
- Shipment tracking
- Payments and invoices
- Saved addresses and recipients
- Notifications
- Support
- Account management

The application should be usable without technical knowledge and should handle loading, offline, failure, and retry scenarios properly.

## 2. Test Setup

Record these before testing:

| Field | Value |
| --- | --- |
| Tester |  |
| Date |  |
| Device |  |
| OS version |  |
| App build/version |  |
| API mode | `mock` / `hybrid` / `laravel` |
| Maps provider | `mock` / native provider |
| Payments provider | `mock` / live provider |
| Test account |  |

Use only development, staging, or test data. Do not use production customer data for UAT.

## 3. Result Key

- Pass: works as expected with clear user feedback.
- Fail: blocks the user or gives wrong information.
- Partial: usable but has visible issue, confusing copy, or missing polish.
- N/A: not applicable to this build or environment.

## 4. Authentication and Startup

| ID | Scenario | Steps | Expected result | Result | Notes |
| --- | --- | --- | --- | --- | --- |
| AUTH-01 | Fresh app launch | Install/open app as a new user. | Startup screen loads clearly with no blank screen. |  |  |
| AUTH-02 | Sign in | Sign in with valid test phone/email credentials. | User reaches Home and session is saved. |  |  |
| AUTH-03 | Invalid sign in | Enter invalid credentials or OTP. | Clear error appears; user can retry. |  |  |
| AUTH-04 | Session restore | Close and reopen app after signing in. | User remains signed in or sees clear login prompt if session expired. |  |  |
| AUTH-05 | Sign out | Use Sign out from Account. | User returns to auth flow; protected screens require login. |  |  |
| AUTH-06 | Account recovery | Start password/account recovery flow. | Recovery screen accepts identifier, OTP/reset states work or show safe error. |  |  |

## 5. Home and Navigation

| ID | Scenario | Steps | Expected result | Result | Notes |
| --- | --- | --- | --- | --- | --- |
| NAV-01 | Home loads | Open Home after login. | Home shows customer state, shipment panels, and primary actions. |  |  |
| NAV-02 | Bottom navigation | Move between Home, Shipments, Send, Bills, Account. | Each tab opens without layout overlap or broken state. |  |  |
| NAV-03 | Back behavior | Enter nested screens and go back. | Back returns to previous logical screen without losing saved draft unexpectedly. |  |  |
| NAV-04 | Small screen layout | Repeat main tab navigation on a small device/viewport. | Buttons remain visible and tappable; no critical content hidden. |  |  |

## 6. Local Pickup and Delivery

| ID | Scenario | Steps | Expected result | Result | Notes |
| --- | --- | --- | --- | --- | --- |
| LOCAL-01 | Start local delivery | Home/Send → Local Delivery. | Map-first route screen opens with bottom drawer. |  |  |
| LOCAL-02 | Search pickup | Search a supported Lusaka area, e.g. Roma. | Suggestions show only supported local places/branches. |  |  |
| LOCAL-03 | Search destination | Search a supported area, e.g. Longacres. | Destination pin updates and map zoom responds. |  |  |
| LOCAL-04 | Unsupported location guard | Search an unsupported country/city, e.g. USA. | No fake result; app explains service is limited to supported areas/branches. |  |  |
| LOCAL-05 | Manual address | Enter manual pickup/delivery details. | App accepts written details without map crash; city remains local service context. |  |  |
| LOCAL-06 | Pin adjustment | Use pickup/destination pin adjustment controls. | Pin state changes and user can confirm. |  |  |
| LOCAL-07 | Vehicle affects estimate | Switch Bike, Small van, Cargo van. | Quote/estimate changes or refreshes; capacity label updates. |  |  |
| LOCAL-08 | Parcel details | Add one or more cargo items. | Continue only when required item details are valid. |  |  |
| LOCAL-09 | Photos/document | Attach cargo photo or support document. | Attachment succeeds or gives safe error/retry message. |  |  |
| LOCAL-10 | Contacts | Enter sender and receiver, optionally from contacts. | Phone/name values populate correctly; invalid required fields block continue. |  |  |
| LOCAL-11 | Schedule | Choose ASAP/later/scheduled option. | Selection persists to review. |  |  |
| LOCAL-12 | Review and submit | Review then submit booking. | Request submits; confirmation shows shipment/reference or clear retryable error. |  |  |

## 7. City-to-City Shipments

| ID | Scenario | Steps | Expected result | Result | Notes |
| --- | --- | --- | --- | --- | --- |
| CITY-01 | Start city-to-city | Send → City-to-City. | Route screen opens map-first with city/branch search. |  |  |
| CITY-02 | Supported origin/destination | Select Lusaka → Kitwe or another supported city. | Map pins move to selected cities; continue enabled. |  |  |
| CITY-03 | Unsupported city guard | Search unsupported city/country. | No unsupported route is selected; user sees clear guard message. |  |  |
| CITY-04 | Cargo details | Add cargo item quantities/details. | Validation is clear and prevents incomplete cargo. |  |  |
| CITY-05 | Contacts | Add sender/receiver or use phone contacts. | Contacts save into draft correctly. |  |  |
| CITY-06 | Fulfilment | Choose collection point or door delivery. | Choice persists to review and affects quote/request payload if connected. |  |  |
| CITY-07 | Submit | Submit city-to-city request. | Confirmation appears with reference, or retryable error. |  |  |

## 8. International Shipments

| ID | Scenario | Steps | Expected result | Result | Notes |
| --- | --- | --- | --- | --- | --- |
| INT-01 | Start import | Send → International Imports. | Method selection opens first. |  |  |
| INT-02 | Method | Choose Air or Sea. | Method persists through route and review. |  |  |
| INT-03 | Supported origin | Search Guangzhou, Shenzhen, Dubai, Dar es Salaam, or backend-supported branch. | Correct city/port/airport suggestions appear. |  |  |
| INT-04 | Supported receiving city | Select Lusaka or backend receiving branch. | Destination pin uses selected branch/city, not current user location. |  |  |
| INT-05 | Unsupported country guard | Search unsupported place, e.g. USA if backend has no branch there. | No fake route; app explains imports only use supported supplier cities/ports/branches. |  |  |
| INT-06 | Cargo and supplier document | Add cargo rows and supplier/debit/delivery note. | Cargo summary and document status are visible on review. |  |  |
| INT-07 | Consignee | Add consignee name and phone. | Continue blocked until required fields are present. |  |  |
| INT-08 | Submit quote request | Submit import request. | Request is received; final quote status is clear. |  |  |

## 9. Custom Requests

| ID | Scenario | Steps | Expected result | Result | Notes |
| --- | --- | --- | --- | --- | --- |
| CUSTOM-01 | Start custom request | Send → Custom Request. | Route screen opens with reusable map/drawer. |  |  |
| CUSTOM-02 | Supported route search | Select supported pickup/destination. | Map responds and route can continue. |  |  |
| CUSTOM-03 | Manual route | Enter manual pickup/destination details. | Details save clearly for team review. |  |  |
| CUSTOM-04 | Request type | Choose cargo/business/other. | Required choice persists. |  |  |
| CUSTOM-05 | Submit | Submit custom request. | Confirmation explains New WorldCargo will review availability/pricing. |  |  |

## 10. Shipment Tracking

| ID | Scenario | Steps | Expected result | Result | Notes |
| --- | --- | --- | --- | --- | --- |
| TRACK-01 | Track known code | Search a valid test tracking number. | Correct shipment opens with status and route. |  |  |
| TRACK-02 | Track unknown code | Search an invalid code. | Not-found state is clear and recoverable. |  |  |
| TRACK-03 | Active shipment map | Open active shipment tracking. | Map/status/timeline display consistently. |  |  |
| TRACK-04 | Completed shipment | Open delivered shipment. | Delivery summary and proof-of-delivery state are visible. |  |  |
| TRACK-05 | Retry failure | Simulate network/API failure while tracking. | Error state has retry and does not silently show wrong shipment. |  |  |

## 11. Payments, Invoices, Wallet, and Receipts

| ID | Scenario | Steps | Expected result | Result | Notes |
| --- | --- | --- | --- | --- | --- |
| PAY-01 | Bills list | Open Bills tab. | Paid/unpaid/overdue invoices are understandable. |  |  |
| PAY-02 | Invoice detail | Open invoice. | Amount, status, route, and line items display correctly. |  |  |
| PAY-03 | Payment method | Open payment methods. | User can see/add/select/remove payment method in supported environment. |  |  |
| PAY-04 | Wallet | Open wallet/payment action if available. | Balance and payment eligibility are clear. |  |  |
| PAY-05 | Pay invoice | Complete mock/staging payment. | Confirmation is shown; invoice state updates or retry message appears. |  |  |
| PAY-06 | Receipt export | Open paid invoice receipt/download/share. | Receipt exports or gives safe native/browser fallback message. |  |  |
| PAY-07 | Payment dispute/help | Start charge review/support from invoice. | Support case is created or retryable error is shown. |  |  |

## 12. Saved Addresses and Recipients

| ID | Scenario | Steps | Expected result | Result | Notes |
| --- | --- | --- | --- | --- | --- |
| ADDR-01 | Saved places list | Account → Saved places. | Existing places load with empty/loading/error states. |  |  |
| ADDR-02 | Add saved place | Add a new place. | Place appears and can be used in booking. |  |  |
| ADDR-03 | Edit saved place | Edit place details. | Updated values persist. |  |  |
| ADDR-04 | Remove saved place | Remove a place. | Confirmation appears; item is removed without deleting unrelated data. |  |  |
| RECIP-01 | Recipients list | Account → Recipients. | Existing recipients load. |  |  |
| RECIP-02 | Add recipient | Add name/phone. | Recipient saves and appears in booking contact choices. |  |  |
| RECIP-03 | Phone contacts | Use device contact picker in booking. | Permission flow is clear; selected contact populates receiver fields. |  |  |

## 13. Notifications

| ID | Scenario | Steps | Expected result | Result | Notes |
| --- | --- | --- | --- | --- | --- |
| NOTIF-01 | Notification inbox | Open notifications. | Inbox loads with clear read/unread state. |  |  |
| NOTIF-02 | Preferences | Open notification preferences. | Shipment/billing/marketing toggles are understandable. |  |  |
| NOTIF-03 | Save preferences | Change preferences and save. | Save success/error state is clear. |  |  |
| NOTIF-04 | Push permission | Trigger push registration if enabled. | Permission prompt/fallback is understandable. |  |  |

## 14. Support

| ID | Scenario | Steps | Expected result | Result | Notes |
| --- | --- | --- | --- | --- | --- |
| SUP-01 | Support home | Open Support. | Support channels and case list are visible. |  |  |
| SUP-02 | Create case | Submit a support case. | Case appears with clear status. |  |  |
| SUP-03 | Attach evidence | Add image/document evidence. | Upload succeeds or shows retryable error. |  |  |
| SUP-04 | Case detail/status | Open an existing case. | Status label is customer-friendly. |  |  |
| SUP-05 | Offline support attempt | Try support action offline. | App blocks safely or queues only if explicitly supported. |  |  |

## 15. Account Management

| ID | Scenario | Steps | Expected result | Result | Notes |
| --- | --- | --- | --- | --- | --- |
| ACC-01 | Account overview | Open Account tab. | Customer name/city/avatar appear correctly. |  |  |
| ACC-02 | Edit profile | Change name/phone in settings. | Profile updates or shows safe validation/error. |  |  |
| ACC-03 | Change profile photo | Choose profile photo. | Photo preview appears; upload updates profile or shows retryable error. |  |  |
| ACC-04 | Remove profile photo | Remove selected profile photo. | Avatar returns to fallback without deleting other data. |  |  |
| ACC-05 | Change password | Submit current/new password. | Success/error state is clear; weak input is blocked. |  |  |
| ACC-06 | Device/session list | Open sign-in activity. | Current device is clear; revoke action confirms before changes. |  |  |
| ACC-07 | Data export | Request data export. | Confirmation appears and state updates. |  |  |
| ACC-08 | Account deletion request | Request deletion. | Strong confirmation appears; request is recorded, not immediate silent deletion. |  |  |
| ACC-09 | Legal/policies | Open terms/privacy/payments. | Legal documents are readable. |  |  |

## 16. Loading, Offline, Failure, and Retry

| ID | Scenario | Steps | Expected result | Result | Notes |
| --- | --- | --- | --- | --- | --- |
| RES-01 | Loading states | Open Home, Shipments, Bills, Support on slow network. | Loading indicators appear; no blank screen. |  |  |
| RES-02 | Offline startup | Open app while offline. | Offline/startup state is understandable. |  |  |
| RES-03 | Offline booking submit | Attempt submit while offline. | User sees safe error; no duplicate or fake success. |  |  |
| RES-04 | Retry read failure | Force API failure then tap retry. | Retry reloads or preserves clear error state. |  |  |
| RES-05 | Upload failure | Fail profile/support/cargo upload. | User sees error and can retry or remove file. |  |  |
| RES-06 | Expired session | Use app after token/session expiry. | User is redirected or prompted without losing unrelated local state. |  |  |
| RES-07 | Double tap submit | Tap submit multiple times quickly. | App prevents duplicate submissions. |  |  |

## 17. Acceptance Criteria

UAT can pass only if:

- A non-technical tester can complete local, city-to-city, international, tracking, billing, support, and account journeys.
- Unsupported routes are not selectable unless returned by backend-supported branches/cities.
- Booking submits do not show fake success when the backend fails.
- Pricing is clearly marked as Laravel/server quote or development fallback.
- Uploads, payments, and support actions show clear loading, success, error, and retry feedback.
- No production data or production repositories are modified during testing.
- No sensitive data appears in logs, errors, screenshots, or exported files.

## 18. Defect Log

| Defect ID | Test ID | Severity | Actual result | Expected result | Evidence/screenshot | Owner | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
|  |  | Critical / High / Medium / Low |  |  |  |  | Open |

