import { View } from "react-native";
import { Screen } from "@/components/ui/nwc-ui";
import { ProfileSkeleton, ListSkeleton } from "@/components/ui/skeleton";
import { Redirect, router, type Href } from "expo-router";
import { AppStateScreen } from "@/components/system/app-state-screen";
import { startupDestination } from "@/lib/startup-flow";
import { useAppStartup } from "@/stores/app-startup";
import { useCustomerAuth } from "@/stores/customer-auth";

export default function StartupScreen() {
  const { scenario, resetScenario, hasCompletedOnboarding, isRestoringOnboarding } = useAppStartup();
  const { customer, isRestoring } = useCustomerAuth();
  const returnToApp = () => { resetScenario(); router.replace(startupDestination("normal", Boolean(customer), hasCompletedOnboarding) as Href); };
  if (scenario === "restoring" || isRestoring || isRestoringOnboarding) return <Screen><View style={{padding:20,gap:24}}><ProfileSkeleton /><ListSkeleton count={2} /></View></Screen>;
  if (scenario === "normal") return <Redirect href={startupDestination("normal", Boolean(customer), hasCompletedOnboarding) as Href} />;
  if (scenario === "offline") return <AppStateScreen eyebrow="Offline safe mode" title="You are offline." detail="You can still view the information saved on this device. New bookings and live shipment updates will resume when you reconnect." icon="wifi-off" tone="warning" primaryLabel="Use saved preview" onPrimary={returnToApp} secondaryLabel="Try again" onSecondary={returnToApp} />;
  if (scenario === "maintenance") return <AppStateScreen eyebrow="Scheduled maintenance" title="We are making an important update." detail="New WorldCargo is temporarily unavailable while we improve the service. Your cargo information remains protected." icon="tools" tone="info" primaryLabel="Check again" onPrimary={returnToApp} secondaryLabel="Return to development controls" onSecondary={() => router.replace("/dev/app-states" as Href)} />;
  if (scenario === "required_update") return <AppStateScreen eyebrow="Update required" title="Update New WorldCargo to continue." detail="This version needs an update before booking, payment, and shipment information can be used safely." icon="download-circle-outline" tone="warning" primaryLabel="Check for update" onPrimary={returnToApp} secondaryLabel="Return to development controls" onSecondary={() => router.replace("/dev/app-states" as Href)} />;
  if (scenario === "optional_update") return <AppStateScreen eyebrow="A new version is ready" title="Update for the latest improvements." detail="You can continue using New WorldCargo now, or update when convenient to get the latest customer experience." icon="download-outline" tone="info" primaryLabel="Continue for now" onPrimary={returnToApp} secondaryLabel="View development controls" onSecondary={() => router.replace("/dev/app-states" as Href)} />;
  return <AppStateScreen eyebrow="Temporary service issue" title="We could not reach New WorldCargo." detail="Your device is safe. Please try again shortly; if the issue continues, contact support when service is available." icon="cloud-alert-outline" tone="error" primaryLabel="Try again" onPrimary={returnToApp} secondaryLabel="Use saved preview" onSecondary={returnToApp} />;
}
