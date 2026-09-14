import { CustomerMap } from "@/components/map/customer-map";
import type { Shipment } from "@/types/cargo";

export function LiveTrackingMap({ shipment }: { shipment: Shipment }) {
  return <CustomerMap mode={shipment.service === "import" ? "international" : "live-local"} deliveryService={shipment.service} shipment={shipment} routeProgress={shipment.trackingProgress?.fraction ?? 0} />;
}
