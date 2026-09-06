export type DeviceReviewStatus = "not-tested" | "pass" | "issue";

export type DeviceReviewCheck = {
  id: string;
  area: string;
  title: string;
  instruction: string;
};

export const deviceReviewChecks: DeviceReviewCheck[] = [
  { id: "small-layout", area: "Layout", title: "Small phone fit", instruction: "Use the smallest supported device. Confirm headers, cards, map sheets, and fixed actions are visible without clipping." },
  { id: "large-layout", area: "Layout", title: "Large phone rhythm", instruction: "Use a tall phone. Confirm content ends naturally and floating navigation does not create unused space." },
  { id: "text-scale", area: "Accessibility", title: "Text scaling", instruction: "Increase system text size. Confirm headings wrap, controls remain tappable, and no text overlaps." },
  { id: "screen-reader", area: "Accessibility", title: "Screen reader order", instruction: "Enable TalkBack or VoiceOver. Confirm every action has a clear label and focus follows visual order." },
  { id: "keyboard", area: "Forms", title: "Keyboard and approve actions", instruction: "Open route search, settings drawers, and recipient forms. Confirm focused fields and approve controls stay reachable." },
  { id: "weak-network", area: "Recovery", title: "Weak network feedback", instruction: "Enable airplane mode or unstable network. Check startup, tracking lookup, and retry states remain clear." },
  { id: "interrupted-flow", area: "Recovery", title: "Interrupted booking", instruction: "Leave a booking mid-flow, reopen the app, then confirm draft resume and delete actions are understandable." },
  { id: "map-gestures", area: "Maps", title: "Map controls and gestures", instruction: "Try drag, pinch, and zoom controls on location picker and Live Tracking. Confirm drawers remain usable." },
  { id: "system-bars", area: "System", title: "Status and navigation bars", instruction: "Check Home, tracking overlay, drawers, and map screens for overlap with device chrome." },
  { id: "receipt-download", area: "Documents", title: "Receipt and proof download", instruction: "Download a receipt and proof of delivery. Confirm the browser or device provides clear file feedback." },
];

export function nextDeviceReviewStatus(current: DeviceReviewStatus): DeviceReviewStatus {
  return current === "not-tested" ? "pass" : current === "pass" ? "issue" : "not-tested";
}
