import { shareService } from "@/lib/services/device/share-service";

export type TrackingActionResult = {
  status: "copied" | "shared" | "downloaded" | "unavailable";
  message: string;
};

export async function copyTrackingNumber(reference: string): Promise<TrackingActionResult> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(reference);
    return { status: "copied", message: "Tracking number copied." };
  }
  return { status: "unavailable", message: "Copy is not available on this device." };
}

export async function shareTrackingNumber(reference: string): Promise<TrackingActionResult> {
  const shared = await shareService.shareDocument({
    title: "New WorldCargo tracking",
    filename: `new-worldcargo-tracking-${reference}.txt`,
    text: `Track shipment ${reference}`,
  });
  if (shared.ok) {
    return { status: "shared", message: "Tracking link shared." };
  }
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(reference);
    return { status: "copied", message: "Sharing is unavailable here. The tracking number was copied instead." };
  }
  return { status: "unavailable", message: "Sharing is not available on this device." };
}
