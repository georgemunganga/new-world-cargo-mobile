# New WorldCargo Mobile Release Checklist

## Before Every Build

- Confirm the target environment: `preview`, `staging`, or `production`.
- Confirm `EXPO_PUBLIC_API_MODE`: `mock`, `hybrid`, or `laravel`.
- Run `corepack pnpm quality`.
- Run `corepack pnpm release:audit` before any shared preview, staging, or production build.
- Confirm no customer-facing screen shows mock-only copy in production mode.
- Confirm no API logs include passwords, tokens, full phone numbers, emails, or addresses.
- Confirm the GitHub token has `workflow` scope before adding or updating `.github/workflows/*`.

## Preview Build

- API mode can be `mock`.
- Browser-safe fallbacks are acceptable.
- Payment provider can remain `mock`.
- Maps provider can remain `mock`.
- Use for internal design and workflow review.

Command:

```bash
corepack pnpm build:preview:android
```

## Staging Build

- API mode should be `hybrid`.
- Completed Laravel endpoints should be enabled.
- Unfinished workflows may still use mock adapters.
- Customer data must be staging/test data only.
- Use for realistic QA and device testing.

Command:

```bash
corepack pnpm build:staging:android
```

## Production Build

- API mode must be `laravel`.
- Production API base URL must be set.
- App identifiers must be final.
- Icons and splash must be final.
- Observability provider should be configured.
- Payments, push notifications, maps, camera, uploads, and sharing must be either production-connected or explicitly disabled with customer-safe UI.

Commands:

```bash
corepack pnpm build:production:android
corepack pnpm build:production:ios
```

## Manual Device Smoke Test

- Open app from fresh install.
- Sign in.
- Restore app after closing.
- Open Home.
- Open Shipments.
- Search shipments.
- Track a known code.
- Track an unknown code.
- Start each booking type.
- Save and resume a draft.
- Open Bills.
- Open invoice detail.
- Complete mock or staging payment flow.
- Open receipt and export.
- Add/edit/remove recipient.
- Add/edit/remove saved place.
- Open support and submit a case.
- Sign out.
- Confirm protected routes redirect to login.

## Store Readiness

- Final app name.
- Final app icon.
- Final screenshots.
- Privacy policy URL.
- Terms URL.
- Support URL.
- Android package ID.
- iOS bundle ID.
- Version and build number.
- Runtime version.
- Native app scheme and supported app links.
- Push notification disclosure if enabled.
- Location usage disclosure if enabled.
- Camera usage disclosure if enabled.
- Account deletion path documented.
