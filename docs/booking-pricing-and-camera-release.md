# Booking pricing and camera release

The mobile app displays backend USD quotes for Local Delivery, City-to-City and International bookings. Confirmation submits the reviewed signed quote. Changed details, expired quotes and server quote rejection require a fresh price and another confirmation. Custom requests retain manual pricing review.

## Backend rollout

Deploy the companion changes in `Cargo-Mangr` before releasing the mobile build:

- Preserve and validate `scheduledAt` when signing quote requests.
- Default booking currency to USD and accept USD in mobile pricing settings.
- Reject explicitly configured non-USD mobile pricing instead of relabelling amounts.
- Use configured mobile rates, not legacy shipment fees whose currency may differ.

In the admin mobile pricing settings, review and save all service and enabled route rates in USD. Existing non-USD amounts are not automatically converted. A non-USD `mobile_pricing_currency` takes precedence over the environment and must be updated together with the rates. If using environment configuration, use `CUSTOMER_PORTAL_BOOKING_CURRENCY=USD` with USD rates and refresh Laravel's configuration cache during deployment.

No production rates, databases or environment files were changed by this code update.

## Native rollout

Cargo attachments include a Take a photo action through the system camera, provided by `expo-image-picker`. Tracking codes are entered by typing them; there is no camera scanner.

On Android and iOS devices, verify denied camera permission and Settings recovery, cancelling capture, and uploading a captured cargo photo.

## Verification

Mobile regression tests are in `tests/reviewed-booking-quote.test.ts` and `tests/camera-capture.test.ts`.

Backend regression tests are in `tests/Feature/CustomerPortalApiTest.php`. Run them in the backend's test environment with `php artisan test --filter=CustomerPortalApiTest`. PHP is not available in the current Windows workspace, so the backend tests must be run in a PHP-enabled environment before release.
