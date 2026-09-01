import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { floatingNavigationDockHeight, floatingNavigationMinimumOffset, floatingNavigationSafeGap } from "@/lib/customer-screen-layout";
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
  if (state.routes[state.index]?.name === "index") return null;
  return <View pointerEvents="box-none" style={styles.wrapper}><View style={[styles.dock, { marginBottom: Math.max(insets.bottom + floatingNavigationSafeGap, floatingNavigationMinimumOffset) }]}>{state.routes.map((route, index) => {
    const focused = state.index === index;
    const item = navigationItems[route.name];
    if (!item) return null;
    const options = descriptors[route.key]?.options;
    const onPress = () => {
      const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
      if (!focused && !event.defaultPrevented) navigation.navigate(route.name as never);
    };
    const onLongPress = () => navigation.emit({ type: "tabLongPress", target: route.key });
      return <TouchableOpacity key={route.key} accessibilityRole="button" accessibilityState={{ selected: focused }} accessibilityLabel={options?.tabBarAccessibilityLabel ?? item.label} accessibilityHint={focused ? `${item.label} tab selected` : `Open ${item.label} tab`} onPress={onPress} onLongPress={onLongPress} activeOpacity={0.74} style={[styles.item, focused ? styles.itemActive : styles.itemInactive]}>{focused ? <><AppIcon name={item.icon} size={24} color={nwcColors.primaryInk} /><Text style={styles.activeLabel}>{item.label}</Text></> : <AppIcon name={item.icon} size={25} color={nwcColors.brandNavy} />}</TouchableOpacity>;
  })}</View></View>;
}

const styles = StyleSheet.create({
  wrapper: { position: "absolute", left: 0, right: 0, bottom: 0, alignItems: "center" },
  dock: { width: "auto", alignSelf: "stretch", minHeight: floatingNavigationDockHeight, marginHorizontal: 16, padding: 7, gap: 7, flexDirection: "row", alignItems: "center", borderRadius: 37, backgroundColor: nwcColors.white, borderWidth: 1, borderColor: "#E4EAED", shadowColor: "#001624", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.19, shadowRadius: 22, elevation: 14 },
  item: { height: 58, borderRadius: 29, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 },
  itemActive: { flex: 1, minWidth: 110, backgroundColor: nwcColors.primary, paddingHorizontal: 15 },
  itemInactive: { width: 58, borderWidth: 1, borderColor: "#DEE5E8", backgroundColor: "#F8FAFA" },
  activeLabel: { color: nwcColors.primaryInk, fontSize: 15, lineHeight: 20, fontFamily: "Poppins_800ExtraBold" },
});
