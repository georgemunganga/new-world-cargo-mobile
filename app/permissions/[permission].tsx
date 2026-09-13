import { StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { AppStateScreen } from "@/components/system/app-state-screen";
import { customerPermissions, type CustomerPermission } from "@/lib/domain/permission";
import { nwcColors } from "@/lib/nwc-theme";
import { useCustomerPermissions } from "@/lib/use-cases/use-customer-permissions";

function validPermission(value: string | string[] | undefined): value is CustomerPermission {
  return typeof value === "string" && value in customerPermissions;
}

export default function PermissionDetailScreen() {
  const { permission } = useLocalSearchParams<{ permission: string }>();
  const { requestPermission, statuses, setStatus } = useCustomerPermissions();
  if (!validPermission(permission)) return <AppStateScreen eyebrow="Permission not found" title="This setting is unavailable." detail="Return to permission controls and choose a supported customer setting." icon="alert-circle-outline" tone="error" primaryLabel="Back to permissions" onPrimary={() => router.replace("/permissions" as never)} />;
  const item = customerPermissions[permission];
  const status = statuses[permission];
  if (status === "denied") return <View style={styles.page}><AppStateScreen eyebrow="Permission unavailable" title={`${item.title} is turned off.`} detail={`${item.manualAlternative} In the connected app, Open Settings will take you to your device controls.`} icon="lock-alert-outline" tone="warning" primaryLabel="Allow for preview" onPrimary={() => { void requestPermission(permission); router.back(); }} secondaryLabel="Use manual alternative" onSecondary={() => router.back()} /></View>;
  return <View style={styles.page}><AppStateScreen eyebrow={status === "granted" ? "Permission enabled" : "Before we ask"} title={status === "granted" ? `${item.title} is ready to use.` : `Allow ${item.title.toLowerCase()}?`} detail={status === "granted" ? "This permission can be changed at any time in the app settings." : item.purpose} icon={item.icon} tone={status === "granted" ? "primary" : "info"} primaryLabel={status === "granted" ? "Back to permissions" : "Allow for preview"} onPrimary={() => { if (status !== "granted") void requestPermission(permission); router.back(); }} secondaryLabel={status === "granted" ? "Turn off for preview" : "Not now"} onSecondary={() => { if (status === "granted") setStatus(permission, "denied"); else setStatus(permission, "denied"); router.back(); }} /></View>;
}

const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: nwcColors.background } });
