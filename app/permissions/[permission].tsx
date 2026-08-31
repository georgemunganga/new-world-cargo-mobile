import { StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { AppStateScreen } from "@/components/system/app-state-screen";
import { mockPermissions, type MockPermission } from "@/lib/mock-permissions";
import { nwcColors } from "@/lib/nwc-theme";
import { useMockPermissions } from "@/stores/mock-permissions";

function validPermission(value: string | string[] | undefined): value is MockPermission {
  return typeof value === "string" && value in mockPermissions;
}

export default function PermissionDetailScreen() {
  const { permission } = useLocalSearchParams<{ permission: string }>();
  const { statuses, setStatus } = useMockPermissions();
  if (!validPermission(permission)) return <AppStateScreen eyebrow="Permission not found" title="This setting is unavailable." detail="Return to permission controls and choose a supported customer setting." icon="alert-circle-outline" tone="error" primaryLabel="Back to permissions" onPrimary={() => router.replace("/permissions")} />;
  const item = mockPermissions[permission];
  const status = statuses[permission];
  if (status === "denied") return <View style={styles.page}><AppStateScreen eyebrow="Permission unavailable" title={`${item.title} is turned off.`} detail={`${item.manualAlternative} In the connected app, Open Settings will take you to your device controls.`} icon="lock-alert-outline" tone="warning" primaryLabel="Allow for preview" onPrimary={() => { setStatus(permission, "granted"); router.back(); }} secondaryLabel="Use manual alternative" onSecondary={() => router.back()} /></View>;
  return <View style={styles.page}><AppStateScreen eyebrow={status === "granted" ? "Permission enabled" : "Before we ask"} title={status === "granted" ? `${item.title} is ready to use.` : `Allow ${item.title.toLowerCase()}?`} detail={status === "granted" ? "This mock permission can be changed at any time in the frontend development controls." : item.purpose} icon={item.icon} tone={status === "granted" ? "primary" : "info"} primaryLabel={status === "granted" ? "Back to permissions" : "Allow for preview"} onPrimary={() => { if (status !== "granted") setStatus(permission, "granted"); router.back(); }} secondaryLabel={status === "granted" ? "Turn off for preview" : "Not now"} onSecondary={() => { if (status === "granted") setStatus(permission, "denied"); else setStatus(permission, "denied"); router.back(); }} /></View>;
}

const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: nwcColors.background } });
