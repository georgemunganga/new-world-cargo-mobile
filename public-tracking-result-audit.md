# Public Tracking Result: Web-to-Mobile Audit

## How the public web page presents a successful tracking check

The public web page keeps the result **on the same tracking page** after a customer submits a code. It presents a compact result card containing the tracking number, cargo name, origin-to-destination route, a visible status chip, and a vertical timeline of tracking events. It then offers **Copy number** and **Share tracking** actions. Before a result is shown, it distinguishes loading, service-unavailable with retry, and shipment-not-found states. [1]

## How mobile currently presents a successful tracking check

The intended mobile interaction is deliberately different, based on your direction: Home’s tracking icon opens a translucent full-screen lookup overlay; after a valid code is found, the overlay closes and the app opens the shipment’s **dedicated tracking screen**. Active shipments use a map-first live screen with courier contact, delivery progress, instructions, and management actions. Completed shipments use a delivery-summary screen with a route card, proof of delivery, and expandable history.

> The mobile does **not** currently leave the customer on the code-entry page with a web-style result card. It moves directly into richer, dedicated tracking detail, which is the correct mobile behavior for a task-first app.

## Remaining details to bring into the dedicated result screens

| Web result element | Current mobile state | Recommended mobile refinement |
|---|---|---|
| Tracking number, cargo name, route, status | Complete on delivered detail; less explicit at the top of active live tracking. | Add a compact identity/status panel above the active tracking details. |
| Chronological event timeline | Available in completed detail; active screen emphasizes map and progress. | Retain map-first active tracking; expose a concise expandable event timeline below progress. |
| Copy number | Not exposed as an actual action in dedicated screens. | Add browser-safe copy feedback to live and delivered screens. |
| Share tracking | Active tracking currently shows mock feedback. | Add browser-safe share/download fallback with a later native-share seam. |
| Lookup loading | Lookup resolves immediately from mock data. | Show a brief deterministic loading state for realistic feedback. |
| Retryable unavailable state | Not represented in the mock lookup overlay. | Add an explicit mock offline/unavailable state with Retry. |
| Public direct link | App has a public `/tracking` entry but no query/deep-link prefill contract. | Add a future-safe `code` parameter contract when mobile deep linking is enabled. |

## Recommendation

Keep the mobile flow you specified: **overlay lookup → dedicated tracking result screen**. Do not copy the web result card literally onto the overlay. Instead, transfer the web’s essential result information—shipment identity, status, activity timeline, copy/share, loading/retry—into the dedicated screens where customers can also see the purpose-aware map and operational actions.

## Reference

[1] [New WorldCargo public web tracking result, `Tracking.tsx`](https://github.com/Newworldcargo/new-world-cargo-app/blob/main/client/src/pages/Tracking.tsx)
