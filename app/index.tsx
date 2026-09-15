import { Redirect, type Href } from "expo-router";
import { startupDestination } from "@/lib/startup-flow";
import { useAppStartup } from "@/stores/app-startup";
import { useCustomerAuth } from "@/stores/customer-auth";

export default function IndexRedirect() {
  const { customer, isRestoring } = useCustomerAuth();
  const { scenario, hasCompletedOnboarding, isRestoringOnboarding } = useAppStartup();
  if (isRestoring || isRestoringOnboarding) return <Redirect href="/startup" />;
  return <Redirect href={startupDestination(scenario, Boolean(customer), hasCompletedOnboarding) as Href} />;
}
