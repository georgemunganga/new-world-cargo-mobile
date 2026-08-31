# New WorldCargo Mobile — Interface Design Plan

## Product intent

New WorldCargo Mobile helps a customer **move and track Katundu** without exposing dispatch, fleet, warehouse, customs, or staff-management complexity. The frontend is mobile-first, portrait-only, and designed for one-handed use on a 9:16 device. The experience should feel native to iOS and familiar on Android: clear hierarchy, large touch targets, plain language, focused forms, sheet-based choices, and one dominant action per screen.

The first delivery establishes the customer-facing shell and a complete **Local Delivery** demonstration flow using local frontend state only. The existing web portal informs brand language, cargo terminology, and core interaction patterns; the mobile workflow specification is the source of truth for information architecture and service design.

## Screen list

| Area | Screen | Primary content and functionality |
| --- | --- | --- |
| App shell | Home | Greeting, location context, unread bell, action-required card, active shipment card, quick route entry, service cards, balance preview, and repeat-shipment entry points. |
| App shell | Shipments | Filterable customer shipment list with status, route, ETA, and clear shipment-detail actions. The first build uses concise local sample records. |
| App shell | Send | Service selection for Import Cargo, City-to-City Katundu, and Local Delivery. The user can begin the Local Delivery path immediately. |
| App shell | Bills | Amount due, wallet context, invoices, receipts, and local empty-state treatment. The first build is presentational and does not collect payment. |
| App shell | Account | Profile summary, saved places, recipients, payment methods, support, and settings entries. |
| Local Delivery | Route | Pickup and delivery fields, saved place shortcuts, route summary, and a primary Continue button. |
| Local Delivery | Parcel | Parcel category, description, quantity, estimated size, special-handling choice, and optional photo placeholder. |
| Local Delivery | Contacts | Sender and receiver details, saved recipient choice, contact number, and delivery instructions. |
| Local Delivery | Schedule | Pickup timing, delivery preference, indicative arrival, and upfront estimate state. |
| Local Delivery | Review | One readable booking summary with per-section Edit actions, price/estimate context, acknowledgement, and confirm action. |
| Local Delivery | Confirmation | Booking reference, next steps, primary Track shipment action, and Return Home action. |
| Shared detail | Shipment detail | Shipment reference, current status, ETA, route, tracking timeline, and context-specific actions. |
| Shared utility | Notifications | Read/unread notification list entered from the header bell; planned after the first Local Delivery flow. |
| Authentication | Welcome and phone-first OTP flow | Planned architecture for later implementation: Welcome, Phone Number, OTP Verification, Existing Account Found, Account Recovery, and New Customer Profile. |

## Layout and interaction pattern

Screens use a white or warm-paper canvas with a fixed native tab bar on the five primary destinations. Page content is vertically scrollable within safe areas, while primary booking actions sit in a bottom-safe action area that remains reachable with one thumb. Headers retain a predictable pattern: a short screen title, optional back action, and an icon-only notification button on root screens.

The booking experience avoids a long logistics form. It moves through short, focused screens with a compact progress treatment: **Route → Parcel → Contacts → Schedule → Review**. Selection controls open as native-feeling cards or sheets; field help explains uncertainty directly, particularly price estimates and delivery timing. The Local Delivery flow will preserve a draft in local state so moving backward never discards entered details.

## Key user flows

| Flow | Steps |
| --- | --- |
| Begin a Local Delivery | Home or Send → select Local Delivery → Route → Parcel → Contacts → Schedule → Review → Confirm booking → Confirmation → Track shipment or Home. |
| Find a current shipment | Home active-shipment card or Shipments tab → Shipment detail → Read status timeline and ETA → act on a visible requirement when one exists. |
| Check money due | Home amount-due card or Bills tab → bill summary → receipt/invoice list. Payment is intentionally not simulated in this frontend-only first version. |
| Reuse a route | Home repeat-shipment entry → Local Delivery route prefilled with prior places → continue through review. |
| Ask for help | Account → Support entry → call or email action uses the device’s supported link handler when enabled later. |

## Color and visual language

The mobile palette preserves the validated New WorldCargo identity while making functional states explicit.

| Token | Value | Use |
| --- | --- | --- |
| `primary` | `#FFC83D` | Primary CTA, selected states, route progress, and decisive emphasis. |
| `primaryInk` | `#0D0D0D` | Text and icons on Cargo Yellow controls. |
| `brandNavy` | `#012642` | Navigation, high-confidence operational surfaces, and primary dark contrast. |
| `background` | `#FFFEFA` | Warm, lightly softened page canvas. |
| `surface` | `#FFFFFF` | Cards, sheets, and forms. |
| `surfaceRaised` | `#F4F7F8` | Selected-neutral and grouped supporting surfaces. |
| `foreground` | `#102A43` | Primary readable text. |
| `muted` | `#61758A` | Helper copy and secondary labels. |
| `border` | `#DCE4E8` | Quiet dividers and control boundaries. |
| `success` | `#1B7F5A` | Delivered, paid, or confirmed state. |
| `warning` | `#B7791F` | Action-required state. |
| `error` | `#C83E3E` | Failed or destructive state. |
| `info` | `#166F9E` | In-progress or informational shipment state. |

Poppins is the intended display and body family, subject to dependable Expo font loading. Hierarchy should come from size, weight, whitespace, and surface contrast, not heavy shadow or decorative gradients. Cards have generous but limited radii, quiet borders, and no nested-card clutter. Cargo Yellow is never used as body-text color on white because it does not supply sufficient reading contrast; its use is paired with dark text, symbols, or borders.

## Reusable component inventory

The initial component system will include `Screen`, `ScrollScreen`, `ScreenHeader`, `PrimaryButton`, `SecondaryButton`, `IconButton`, `StatusBadge`, `SectionHeader`, `InfoCard`, `ActionRequiredCard`, `ServiceCard`, `ShipmentCard`, `RouteField`, `AddressShortcut`, `ChoiceCard`, `ProgressSteps`, `FormField`, `SummaryRow`, `BookingFooter`, and `EmptyState`.

Components own accessibility labels, disabled/loading/pressed states, minimum touch targets, text scaling, and status labels plus icons. Presentational components accept callbacks and data rather than routing themselves. Screens own navigation decisions and compose components around domain models.

## First-build domain models

```ts
type ServiceType = "import" | "intercity" | "local";
type ShipmentStatus = "action_required" | "booking_confirmed" | "in_transit" | "out_for_delivery" | "delivered";
type FulfilmentOption = "pickup" | "delivery";
type BookingStep = "route" | "parcel" | "contacts" | "schedule" | "review";

type Address = {
  label?: string;
  city: string;
  area: string;
  detail: string;
};

type LocalDeliveryDraft = {
  service: "local";
  step: BookingStep;
  pickup?: Address;
  destination?: Address;
  parcelCategory?: string;
  parcelDescription?: string;
  quantity?: number;
  handling?: "standard" | "fragile";
  senderName?: string;
  senderPhone?: string;
  receiverName?: string;
  receiverPhone?: string;
  deliveryInstructions?: string;
  schedule?: "as_soon_as_possible" | "later_today" | "scheduled";
};
```

## Frontend boundaries for this first delivery

This delivery is intentionally frontend-only. It uses deterministic local sample data and local in-memory booking drafts to make every path demonstrable without pretending that booking, payment, authentication, tracking, or file upload has reached the live operational backend. Server and database integration will be introduced only after the mobile customer experience is signed off and the required production contracts are confirmed.

