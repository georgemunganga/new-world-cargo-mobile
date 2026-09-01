export type TrackingActionResult = {
  status: "copied" | "shared" | "downloaded" | "unavailable";
  message: string;
};

export async function copyTrackingNumber(reference: string): Promise<TrackingActionResult> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(reference);
    return { status: "copied", message: "Tracking number copied." };
  }
  return { status: "unavailable", message: "Copy is not available in this preview." };
}

export async function shareTrackingNumber(reference: string): Promise<TrackingActionResult> {
  if (typeof navigator !== "undefined" && navigator.share) {
    await navigator.share({ title: "New WorldCargo tracking", text: `Track shipment ${reference}` });
    return { status: "shared", message: "Tracking link shared." };
  }
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(reference);
    return { status: "copied", message: "Sharing is unavailable here. The tracking number was copied instead." };
  }
  return { status: "unavailable", message: "Sharing is not available in this preview." };
}
