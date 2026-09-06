# New WorldCargo Physical-Device Accessibility Review

## Purpose

This review must be completed on real Android and iOS devices before the mobile UI is described as production-ready. The browser preview and deterministic tests confirm code behavior, but cannot verify device chrome, text scaling, touch interaction, keyboard movement, accessibility focus, or map gestures.

## Setup

Use at least one small phone and one large phone. Open the latest project in Expo Go or a device build. Start the checklist from **Development controls → Physical device review**. Each check is initially **Not tested**; tapping it cycles the status through **Pass**, **Issue**, and back to **Not tested**.

| Area | Test | Pass condition |
|---|---|---|
| Layout | Small phone fit | No clipped headers, fixed buttons, drawers, cards, or map controls. |
| Layout | Large phone rhythm | Content ends naturally; no artificial bottom gap or floating-navigation overlap. |
| Accessibility | Text scaling | At increased system text size, controls remain visible and text does not overlap. |
| Accessibility | Screen reader order | VoiceOver/TalkBack labels are clear and focus follows the visual order. |
| Forms | Keyboard | Inputs, bottom drawers, and approval buttons remain usable with the keyboard open. |
| Recovery | Weak network | Startup and tracking search show clear retry/manual-alternative behavior. |
| Recovery | Interrupted booking | Saved draft resume and delete behavior are understandable after leaving a booking flow. |
| Maps | Gestures | Location-picker and tracking map pan/zoom controls do not obstruct sheets or actions. |
| System | System bars | Top command bar, overlays, drawers, and maps respect status/navigation bars. |
| Documents | Downloads | Receipt and proof downloads provide clear browser/device feedback. |

## Report issues

For each issue, record the device and OS version, screen name, font size/accessibility setting, exact steps, expected result, observed result, and a screenshot or recording where possible. Add every issue to `todo.md` before changing the corresponding screen.

> Do not mark the app UI production-ready until all P0/P1 screens in `production-ui-screen-gap-register.md` are complete and this physical-device review has been recorded on both Android and iOS.
