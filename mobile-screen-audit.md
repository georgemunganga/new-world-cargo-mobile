# New WorldCargo Mobile Screen Standards and Audit

## Quality gate for every screen

The attached **Universal Mobile Screen Standards** are now the project quality gate. Every new or revised customer screen must be classified before implementation, use the shared safe-area screen container, rely on standard gutters, have a defined overflow strategy, and give primary actions a reachable bottom region. Forms must preserve an active field when the keyboard opens; list/detail screens need clear loading, empty, and error states; and every interactive target needs an accessible label and a minimum 44-point target.

| Criterion | New WorldCargo standard |
|---|---|
| Screen type | Document each screen as content, list, form, detail, map, sheet, wizard, authentication, or system state before altering it. |
| Outer layout | Use `Screen` / `ScreenContainer`; do not add device-specific outer dimensions or invent safe-area handling within individual screens. |
| Gutters | Use the established 20-point customer-screen gutter unless a full-bleed map/media screen requires a documented exception. |
| Overflow | Make lengthy content scroll. Preserve clearance for floating navigation and any persistent action region. |
| Header | Use clear context, a 44-point back/action target where navigation needs it, and no unnecessary control density. |
| Forms | Use visible labels, correctly labeled inputs, keyboard-aware content, near-field feedback, and clear disabled behavior. |
| Primary actions | Put wizard/payment actions in a safe-area-aware footer; keep secondary actions visually subordinate. |
| Lists | Use reusable rows, accessible whole-row activation, and deterministic loading, empty, and error states. |
| Typography | Use the shared Poppins hierarchy on native and the browser-safe system fallback on web; keep text capable of wrapping. |
| Validation | Update `todo.md`, run TypeScript, tests, and lint, then checkpoint only the verified batch. |

## Screen-by-screen audit register

| Customer area | Screen type | Current assessment | Priority action |
|---|---|---|---|
| Startup and authentication | System / authentication | **Improved.** Session restoration previously returned a blank tab layout. It now routes to the dedicated Startup screen. The auth shell already supports keyboard-safe scrolling. | Verify small-device text scaling and restore-flow timing on a physical device. |
| Home | Dashboard / content | **Rebuilt.** The black full-width command bar and fragmented uneven service layout are replaced by an inset greeting header, one clear Send cargo action, a compact four-service grid, and a two-item recent-shipment preview. Shared content insets manage safe top and natural bottom spacing. | Medium: review long customer/shipment labels and test the revised Home hierarchy on physical devices. |
| Shipments | List / feed | **Repaired.** It has search, filters, deterministic empty treatment, and shared floating-dock clearance. | Low: review long destination labels and filter wrapping. |
| Live tracking | Map / detail | Reusable map modes, tracking status, contact actions, instructions, and proof context are present. It remains a high-risk overlay screen. | High: audit safe-area/keyboard behavior for controls over the map at short viewport heights. |
| Local Delivery route | Full-screen map / sheet | **Repaired.** The purpose-aware map now fills its caller rather than using a fixed 760-point backdrop; the sheet receives safe bottom clearance and keyboard-aware layout. | High: test the full-bleed map sheet across web and physical devices. |
| Import, City-to-City, Custom Request | Wizard / form | Shared route entry and service-specific questions are present. Sticky footer and keyboard behavior have now been standardized through `BookingScreen`. | Verify every field’s return key, validation, and final action on small screens. |
| Bills and wallet | List / detail / payment | Ledger, filters, detail, document actions, payment result, wallet, reminders, and resolution timelines are present with mock data. | Medium: audit long invoice routes/charge rows and ensure every pay state has appropriate footer clearance. |
| Account, permissions, notifications | Settings / form | Customer-facing mock states exist but need a focused action and state audit. | Medium: make every listed action navigable or visibly disabled with explanation. |
| Delivery summary / completed shipment | Detail | Primary status and route hierarchy plus mock proof of delivery are present. | Low: add share and accessible evidence-review flow. |

## First implemented shared repairs

This audit batch fixes four broad risks. While customer session state is restoring, the tab layout now redirects to the existing Startup screen rather than rendering nothing. All shared booking wizards now use keyboard avoidance, drag-to-dismiss behavior, persistent-action clearance, bottom safe-area padding, and accessible field labels. Home now uses a shared content inset rather than a header crowded toward the top edge or arbitrary bottom space. The new layout contract also supplies one floating-navigation clearance value to Send, Shipments, Bills, and Account, while the Local Delivery map fills its own container instead of assuming a 760-point height.

## Next repair batch

The next screen-by-screen batch should focus on the full-bleed **Local Delivery route** screen: safe-area header offsets, sheet height under short browser/mobile viewports, keyboard interaction, zoom controls, and action-sheet clearance. After that, standardize floating navigation clearance across each tab and complete Account/notification action destinations.
