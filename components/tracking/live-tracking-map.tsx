import { useEffect, useState } from "react";
import { CustomerMap } from "@/components/map/customer-map";
import type { Shipment } from "@/types/cargo";

export function LiveTrackingMap({ shipment }: { shipment: Shipment }) {
  const baseProgress = shipment.trackingProgress?.fraction ?? 0.42;
  const [progress, setProgress] = useState(baseProgress);
  useEffect(() => { const timer = setInterval(() => setProgress((current) => current >= 0.88 ? Math.max(0.16, baseProgress - 0.12) : Math.min(0.92, Number((current + 0.045).toFixed(3)))), 2400); return () => clearInterval(timer); }, [baseProgress]);
  return <CustomerMap mode={shipment.service === "import" ? "international" : "live-local"} shipment={shipment} routeProgress={progress} />;
}
