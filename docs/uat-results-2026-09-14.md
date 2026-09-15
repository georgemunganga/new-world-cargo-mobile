# NewWorld Cargo Mobile UAT Results — 2026-09-14

## Production-connected pricing assessment

- Customer API: `https://api.newworldcargo.com/api/v1/`
- API mode: Laravel; production pricing remains server-authoritative.
- Production health and readiness endpoints passed.
- No production database records or environment values were changed during this assessment.

## Confirmed error log

| Severity | Area | Error | Evidence and status |
| --- | --- | --- | --- |
| High | Local Delivery pricing | HTTP 503 `PRICING_NOT_CONFIGURED`: “Pricing is not available for this service in the current environment.” | Confirmed by deployed Laravel configuration. Local base/per-km values are absent and both admin shipment-setting fallbacks are non-positive. Mobile now preserves the server code, records a redacted telemetry event, shows a loading state, and provides Retry price. |
| High | City-to-City pricing | Automated quote cannot succeed with current production configuration. | Intercity base fee is absent. Mobile requests a signed server quote during submission, but the review screen does not yet show a pre-confirmation quote. |
| High | International pricing | Automated quote cannot succeed with current production configuration. | Import base fee is absent. Mobile requests a signed server quote during submission, but the review screen does not yet show a pre-confirmation quote. |

## Configuration required before pricing UAT can pass

Business-approved positive base fees are required for Local Delivery, City-to-City, and International services. Per-kilometre and per-kilogram rates may be zero when that charge is intentionally unused. Rate values must not be invented or calculated in the production mobile client.

After approved rates are configured, repeat authenticated quote tests for all three services and verify the displayed total, charge breakdown, currency, expiry, signature, and booking submission.

## Contract observations

- The app sends service and booking type, pickup/destination city and coordinates, branch IDs where available, vehicle or transport mode, fulfilment, schedule, cargo items, total weight, declared value, and fragile handling.
- Laravel recomputes straight-line distance from coordinates and signs each stored quote for 15 minutes.
- Local Delivery displays a route quote before continuing. City-to-City and International currently obtain a fresh quote only during final submission; their review pages must expose the quote before customer confirmation to satisfy UAT.
