import { View, StyleSheet } from "react-native";
import { AppIcon, type AppIconName } from "@/components/ui/app-icon";
import { nwcColors } from "@/lib/nwc-theme";

export function CustomerTabIcon({ icon, color, focused, featured = false }: { icon: AppIconName; color: string; focused: boolean; featured?: boolean }) {
  if (featured) return <View style={styles.featuredIcon}><AppIcon name={icon} size={24} color={nwcColors.primaryInk} /></View>;
  return <AppIcon name={icon} size={23} color={color} />;
}

const styles = StyleSheet.create({
  featuredIcon: {
    width: 44,
    height: 44,
    marginTop: -15,
    borderRadius: 22,
    backgroundColor: nwcColors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: nwcColors.background,
  },
});
