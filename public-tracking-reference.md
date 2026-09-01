# Public Tracking Workflow Reference

## Source

[New WorldCargo web public tracking page](https://github.com/Newworldcargo/new-world-cargo-app/blob/main/client/src/pages/Tracking.tsx)

## Customer workflow to preserve in mobile

The public web experience gives customers a single tracking-number entry field, explicit validation when the field is blank, and a compact QR-scan entry point. It communicates a temporary camera-permission state, then offers a sample scan and cancellation path. Lookup has distinct loading, temporarily-unavailable, and shipment-not-found states.

When a shipment is found, the web page shows the tracking number, cargo name, origin-to-destination route, current status, a chronological progress timeline, and copy/share controls. The mobile implementation should retain the same task sequence but route customers into the existing purpose-aware Live Tracking or delivered-shipment detail screen after a successful deterministic lookup.

> Mobile scope remains browser-safe and mock-only. The scan control is a typed-code fallback and visual native-camera seam; it must not attempt browser camera access in this phase.
