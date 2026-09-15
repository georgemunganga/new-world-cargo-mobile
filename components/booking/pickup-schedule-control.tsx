import { useState } from "react";
import { Platform, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CustomerBottomDrawer } from "@/components/ui/customer-bottom-drawer";
import { PrimaryButton } from "@/components/ui/nwc-ui";
import { AppIcon } from "@/components/ui/app-icon";
import { nwcColors } from "@/lib/nwc-theme";
import { isPickupTimeValid, pickupTimeLabel } from "@/lib/pickup-schedule";

export function PickupScheduleControl({ value, onChange }: { value?: string; onChange: (value?: string) => void }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(new Date());
  const [mode, setMode] = useState<"date" | "time" | null>(null);
  const [error, setError] = useState("");
  const show = () => { setSelected(value && isPickupTimeValid(value) ? new Date(value) : new Date()); setMode(null); setError(""); setOpen(true); };
  const close = () => { setMode(null); setOpen(false); };
  const save = () => {
    if (!isPickupTimeValid(selected.toISOString())) { setError("Choose the current time or a later pickup time."); return; }
    onChange(selected.toISOString()); close();
  };
  const dateLabel = selected.toDateString() === new Date().toDateString() ? "Today" : selected.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
  return <><View style={styles.row}><View style={styles.icon}><AppIcon name="calendar-clock" size={24} color={nwcColors.brandNavy} /></View><TouchableOpacity accessibilityRole="button" accessibilityLabel="Choose pickup schedule" onPress={show} style={{ flex: 1 }}><Text style={styles.title}>Schedule pickup</Text><Text style={styles.detail}>{value ? pickupTimeLabel(value) : "Earliest available when off"}</Text></TouchableOpacity><Switch accessibilityLabel="Schedule pickup" value={Boolean(value) || open} onValueChange={(enabled) => enabled ? show() : onChange(undefined)} trackColor={{ false: "#DCE4E8", true: nwcColors.primary }} thumbColor={nwcColors.white} /></View>
    <CustomerBottomDrawer visible={open} title="Schedule pickup" detail="Choose when you would like us to collect your cargo." onDismiss={close} initialSnap="half" footer={<PrimaryButton label="Save pickup time" onPress={save} icon="check" />}>
      <View style={styles.preview}><AppIcon name="calendar-clock" size={30} color={nwcColors.primary} /><View><Text style={styles.previewDate}>{dateLabel}</Text><Text style={styles.previewTime}>{selected.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text></View></View>
      <View style={styles.fields}>{(["date", "time"] as const).map((field) => <TouchableOpacity key={field} accessibilityRole="button" accessibilityLabel={`Change pickup ${field}`} onPress={() => setMode(field)} style={styles.field}><AppIcon name={field === "date" ? "calendar-outline" : "clock-outline"} size={21} color={nwcColors.brandNavy} /><Text style={styles.title}>{field === "date" ? dateLabel : selected.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text><AppIcon name="chevron-down" size={18} color={nwcColors.muted} /></TouchableOpacity>)}</View>
      {mode && Platform.OS !== "web" ? <DateTimePicker value={selected} mode={mode} minimumDate={mode === "date" ? new Date() : undefined} display={Platform.OS === "ios" ? "spinner" : "default"} accentColor={nwcColors.primary} onChange={(event, next) => { if (Platform.OS === "android") setMode(null); if (event.type === "set" && next) { const merged = new Date(selected); if (mode === "date") merged.setFullYear(next.getFullYear(), next.getMonth(), next.getDate()); else merged.setHours(next.getHours(), next.getMinutes(), 0, 0); setSelected(merged); setError(""); } }} /> : null}
      {error ? <Text accessibilityRole="alert" style={{ color: nwcColors.error }}>{error}</Text> : null}<Text style={styles.detail}>Times use your phone’s time zone. Pickup is subject to availability.</Text>
    </CustomerBottomDrawer></>;
}
const styles = StyleSheet.create({ row: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 20, backgroundColor: nwcColors.surface }, icon: { backgroundColor: nwcColors.surfaceAccent, padding: 10, borderRadius: 14 }, title: { fontSize: 14, fontFamily: "Poppins_600SemiBold", color: nwcColors.brandNavy }, detail: { fontSize: 12, lineHeight: 18, color: nwcColors.muted }, preview: { flexDirection: "row", gap: 18, alignItems: "center", backgroundColor: nwcColors.brandNavy, padding: 20, borderRadius: 22 }, previewDate: { color: "white", fontSize: 14, fontFamily: "Poppins_500Medium" }, previewTime: { color: nwcColors.primary, fontSize: 28, fontFamily: "Poppins_700Bold" }, fields: { flexDirection: "row", gap: 10 }, field: { flex: 1, minHeight: 56, padding: 10, borderRadius: 16, backgroundColor: nwcColors.surfaceAccent, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 4 } });
