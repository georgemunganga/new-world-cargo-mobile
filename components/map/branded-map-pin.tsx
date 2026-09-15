import { View, StyleSheet } from "react-native";
import { AppIcon, type AppIconName } from "@/components/ui/app-icon";
import { nwcColors } from "@/lib/nwc-theme";
export function BrandedMapPin({ kind = "selected" }: { kind?: "pickup" | "destination" | "selected" | "current" | "vehicle" | "office" }) {
  const icons: Record<string, AppIconName> = { pickup: "package-variant", destination: "flag-checkered", selected: "crosshairs", current: "account", vehicle: "truck", office: "warehouse" };
  return <View collapsable={false} style={styles.wrap}><View style={styles.head}><AppIcon name={icons[kind]} size={23} color={nwcColors.brandNavy} /></View><View style={styles.tip} /></View>;
}
const styles = StyleSheet.create({ wrap: { width: 52, height: 64, alignItems: "center" }, head: { zIndex: 2, width: 48, height: 48, borderRadius: 24, borderWidth: 3, borderColor: nwcColors.white, backgroundColor: nwcColors.primary, alignItems: "center", justifyContent: "center", elevation: 3 }, tip: { width: 19, height: 19, backgroundColor: nwcColors.primary, transform: [{ rotate: "45deg" }], marginTop: -10, borderBottomWidth: 2, borderRightWidth: 2, borderColor: nwcColors.white } });
