# Mobile and customer portal Laravel auth contract audit

Date: 2026-09-13

## Decision

Do not create a separate Laravel `MobileApi` module yet.

Use the existing `Modules/CustomerPortalApi` as the shared backend boundary for:

- the web customer portal;
- the mobile application;
- customer-owned shipments, drafts, wallet, invoices, recipients, addresses, profile, notifications, returns, pickups, support, uploads, and tracking.

Add mobile-specific endpoints inside that module only where the transport or device behaviour is genuinely different, such as native session exchange, push device registration, biometric device trust, app version checks, and mobile telemetry.

## Why this is better for scale

A separate mobile module would duplicate customer business rules and eventually drift from the web customer portal. Shipments, wallet balances, recipients, invoices, saved addresses, profile rules, and tracking should not have two different backends.

The scalable shape is:

```text
Modules/CustomerPortalApi
├── Auth
├── Profile
├── Shipments
├── Drafts
├── Wallet / Invoices / Payments
├── Address Book
├── Uploads
├── Support
├── Device / Mobile Session
└── Shared contract resources and policies
```

## Laravel production API found on this server

The live customer portal API is mounted at:

```text
/api/v1
```

Auth/profile routes found:

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/auth/csrf` | Issue/read portal CSRF state |
| `POST` | `/api/v1/auth/login` | Login by email or phone |
| `POST` | `/api/v1/auth/register` | Register customer account |
| `POST` | `/api/v1/auth/verify` | Verify six-digit registration/contact OTP |
| `POST` | `/api/v1/auth/verify/resend` | Resend contact verification OTP |
| `POST` | `/api/v1/auth/password/forgot` | Request password reset email |
| `POST` | `/api/v1/auth/password/reset` | Reset password with email token |
| `POST` | `/api/v1/auth/password/verify` | Verify current password for sensitive actions |
| `POST` | `/api/v1/auth/password/change` | Change password while signed in |
| `GET` | `/api/v1/session` | Return current authenticated customer |
| `POST` | `/api/v1/auth/logout` | End session |
| `GET` | `/api/v1/profile` | Return current customer profile |
| `PATCH` | `/api/v1/profile` | Update profile |

The response envelope is:

```json
{
  "data": {},
  "requestId": "..."
}
```

Errors use:

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Please correct the highlighted fields.",
    "retryable": false,
    "fieldErrors": {}
  },
  "requestId": "..."
}
```

## Mobile repo changes made from this audit

The mobile Laravel auth/profile adapters now target the real customer portal routes:

- `/api/v1/auth/login`
- `/api/v1/auth/register`
- `/api/v1/auth/verify`
- `/api/v1/auth/verify/resend`
- `/api/v1/auth/password/forgot`
- `/api/v1/auth/password/reset`
- `/api/v1/auth/password/change`
- `/api/v1/session`
- `/api/v1/auth/logout`
- `/api/v1/profile`

The mobile API client now understands:

- Laravel portal error codes such as `CONTACT_UNVERIFIED`, `OTP_INVALID`, `OTP_EXPIRED`, `CURRENT_PASSWORD_INVALID`, and `CSRF_TOKEN_MISMATCH`;
- Laravel cookie/CSRF behaviour for web/BFF usage by sending credentials and the `nwc_csrf` cookie value as `X-CSRF-Token` when available.

## Contract gaps backend should add or confirm

These are not reasons to create a new module. They are reasons to extend `CustomerPortalApi`.

1. Native mobile session exchange

   The current API is mainly web-session/BFF friendly. Native mobile should not depend on browser cookies. Laravel should expose or finalize a mobile session exchange inside `CustomerPortalApi`, for example:

   - issue mobile access/refresh tokens;
   - rotate refresh tokens;
   - revoke one device session;
   - expose current device sessions;
   - support biometric trusted-device flow.

2. Password reset flow

   Laravel currently uses email reset token/link semantics:

   ```json
   {
     "email": "customer@example.com",
     "token": "reset-token",
     "password": "new-password",
     "password_confirmation": "new-password"
   }
   ```

   The mobile UI currently looks like an OTP reset flow. Either:

   - backend adds phone/email OTP password reset endpoints; or
   - mobile UI changes copy to “paste reset token from email” / handles deep links from the email reset link.

3. Feature endpoint parity

   The old mobile Laravel adapters still contain placeholder `/api/customer/*` paths for several non-auth areas. They should be migrated feature-by-feature to `/api/v1/*` contract paths and DTOs:

   - shipments;
   - tracking;
   - invoices and wallet;
   - payment intents;
   - shipment drafts and quotes;
   - addresses and recipients;
   - support cases;
   - returns and pickups;
   - upload intents.

## Rule going forward

Mobile and web customer portal define one customer contract. Laravel implements that contract in `Modules/CustomerPortalApi`.

Create a new backend module only if the domain ownership is different. Native mobile is not a different domain; it is a different client for the same customer domain.
