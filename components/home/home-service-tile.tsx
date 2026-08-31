import { Image, StyleSheet, Text, TouchableOpacity, View, type ImageSourcePropType } from "react-native";
import { AppIcon, type AppIconName } from "@/components/ui/app-icon";
import { nwcColors } from "@/lib/nwc-theme";

export function HomeServiceTile({ title, subtitle, capacity, icon, image, variant = "half", onPress }: { title: string; subtitle?: string; capacity?: string; icon: AppIconName; image?: ImageSourcePropType; variant?: "half" | "wide" | "custom"; onPress: () => void }) {
  const dark = variant === "custom";
  return <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Choose ${title}`} accessibilityHint={subtitle} onPress={onPress} activeOpacity={0.76} style={[styles.tile, styles[variant]]}><View style={styles.copy}><Text numberOfLines={2} style={[styles.title, dark && styles.darkText]}>{title}</Text>{subtitle ? <Text numberOfLines={1} style={[styles.subtitle, dark && styles.darkSubtext]}>{subtitle}</Text> : null}</View>{capacity ? <Text style={[styles.capacity, dark && styles.darkSubtext]}>{capacity}</Text> : null}{variant === "custom" ? <AppIcon name="arrow-top-right" size={48} color={nwcColors.white} style={styles.customIcon} /> : image ? <Image accessibilityIgnoresInvertColors source={image} resizeMode="contain" style={[styles.vehicleImage, variant === "wide" && styles.wideVehicleImage]} /> : <AppIcon name={icon} size={variant === "wide" ? 60 : 53} color={dark ? nwcColors.white : nwcColors.primaryInk} style={styles.vehicleIcon} />}</TouchableOpacity>;
}

const styles = StyleSheet.create({
  tile: { position: "relative", overflow: "hidden", borderRadius: 24, padding: 15, backgroundColor: nwcColors.white, borderWidth: 1, borderColor: "#E8EDEF", justifyContent: "space-between" },
  half: { width: "48.4%", minHeight: 145 },
  wide: { width: "64.8%", minHeight: 142 },
  custom: { width: "32%", minHeight: 142, backgroundColor: nwcColors.brandNavy, borderColor: nwcColors.brandNavy },
  copy: { maxWidth: "82%", gap: 1 },
  title: { color: nwcColors.foreground, fontSize: 16, lineHeight: 21, fontFamily: "Poppins_800ExtraBold", letterSpacing: -0.25 },
  subtitle: { color: nwcColors.muted, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_500Medium" },
  capacity: { color: nwcColors.foreground, fontSize: 11, lineHeight: 15, fontFamily: "Poppins_600SemiBold" },
  darkText: { color: nwcColors.white },
  darkSubtext: { color: "#C9D7E1" },
  vehicleIcon: { position: "absolute", right: -8, bottom: 5, opacity: 0.94 },
  vehicleImage: { position: "absolute", right: -10, bottom: -3, height: 84, width: 112 },
  wideVehicleImage: { right: -8, bottom: -10, height: 128, width: 166 },
  customIcon: { position: "absolute", right: 11, bottom: 12 },
});
