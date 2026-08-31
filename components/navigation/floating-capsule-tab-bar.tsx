import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppIcon, type AppIconName } from "@/components/ui/app-icon";
import { nwcColors } from "@/lib/nwc-theme";

const navigationItems: Record<string, { label: string; icon: AppIconName }> = {
  index: { label: "Home", icon: "home-variant-outline" },
  shipments: { label: "Shipments", icon: "package-variant-closed" },
  send: { label: "Send", icon: "map-marker-outline" },
  bills: { label: "Bills", icon: "receipt-text-outline" },
  account: { label: "Account", icon: "account-circle-outline" },
};

export function FloatingCapsuleTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return <View pointerEvents="box-none" style={styles.wrapper}><View style={[styles.dock, { marginBottom: Math.max(insets.bottom, 12) }]}>{state.routes.map((route, index) => {
    const focused = state.index === index;
    const item = navigationItems[route.name];
    if (!item) return null;
    const options = descriptors[route.key]?.options;
    const onPress = () => {
      const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
      if (!focused && !event.defaultPrevented) navigation.navigate(route.name as never);
    };
    const onLongPress = () => navigation.emit({ type: "tabLongPress", target: route.key });
    return <TouchableOpacity key={route.key} accessibilityRole="button" accessibilityState={{ selected: focused }} accessibilityLabel={options?.tabBarAccessibilityLabel ?? item.label} accessibilityHint={focused ? `${item.label} tab selected` : `Open ${item.label} tab`} onPress={onPress} onLongPress={onLongPress} activeOpacity={0.74} style={[styles.item, focused ? styles.itemActive : styles.itemInactive]}>{focused ? <><AppIcon name={item.icon} size={21} color={nwcColors.primaryInk} /><Text style={styles.activeLabel}>{item.label}</Text></> : <AppIcon name={item.icon} size={22} color={nwcColors.brandNavy} />}</TouchableOpacity>;
  })}</View></View>;
}

const styles = StyleSheet.create({
  wrapper: { position: "absolute", left: 0, right: 0, bottom: 0, alignItems: "center" },
  dock: { width: "auto", alignSelf: "stretch", minHeight: 60, marginHorizontal: 18, padding: 5, gap: 5, flexDirection: "row", alignItems: "center", borderRadius: 30, backgroundColor: nwcColors.white, borderWidth: 1, borderColor: "#E4EAED", shadowColor: "#001624", shadowOffset: { width: 0, height: 9 }, shadowOpacity: 0.18, shadowRadius: 18, elevation: 12 },
  item: { height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 7 },
  itemActive: { flex: 1, minWidth: 88, backgroundColor: nwcColors.primary, paddingHorizontal: 13 },
  itemInactive: { width: 48, borderWidth: 1, borderColor: "#DEE5E8", backgroundColor: "#F8FAFA" },
  activeLabel: { color: nwcColors.primaryInk, fontSize: 14, lineHeight: 18, fontFamily: "Poppins_800ExtraBold" },
});
