import { View, StyleSheet } from "react-native";
import { AppIcon, type AppIconName } from "@/components/ui/app-icon";
import { nwcColors } from "@/lib/nwc-theme";

export function CustomerTabIcon({ icon, color, focused, featured = false }: { icon: AppIconName; color: string; focused: boolean; featured?: boolean }) {
  if (featured) return <View style={[styles.featuredIcon, focused && styles.featuredIconFocused]}><AppIcon name={icon} size={24} color={nwcColors.primaryInk} /></View>;
  return <View style={[styles.iconWrap, focused && styles.iconWrapFocused]}><AppIcon name={icon} size={21} color={color} /></View>;
}

const styles = StyleSheet.create({
  featuredIcon: {
    width: 48,
    height: 48,
    marginTop: -19,
    borderRadius: 18,
    backgroundColor: nwcColors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: nwcColors.background,
    shadowColor: "#001624",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 6,
  },
  featuredIconFocused: { transform: [{ translateY: -1 }] },
  iconWrap: { width: 32, height: 28, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  iconWrapFocused: { backgroundColor: "rgba(255, 255, 255, 0.12)" },
});
