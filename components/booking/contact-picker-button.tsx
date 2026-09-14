import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { AppIcon } from "@/components/ui/app-icon";
import { nwcColors } from "@/lib/nwc-theme";
import { contactService, type DeviceContact } from "@/lib/services/device/contact-service";

export function ContactPickerButton({ label = "Choose from phone contacts", onContact }: { label?: string; onContact: (contact: DeviceContact) => void }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const pick = async () => {
    setLoading(true);
    setMessage("");
    const result = await contactService.pickContact();
    setLoading(false);
    if (result.ok) {
      onContact(result.value);
      setMessage(`Selected ${result.value.name || result.value.phone}.`);
      return;
    }
    setMessage(result.message);
  };

  return <View style={styles.wrap}><TouchableOpacity accessibilityRole="button" accessibilityLabel={label} accessibilityHint="Open your phone contacts and fill the recipient name and phone number" activeOpacity={0.76} disabled={loading} onPress={pick} style={[styles.button, loading && styles.buttonDisabled]}><View style={styles.icon}><AppIcon name="contacts-outline" size={19} color={nwcColors.brandNavy} /></View><Text style={styles.label}>{loading ? "Opening contacts..." : label}</Text><AppIcon name="chevron-right" size={18} color={nwcColors.info} /></TouchableOpacity>{message ? <Text style={styles.message}>{message}</Text> : null}</View>;
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  button: { minHeight: 48, borderRadius: 16, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", gap: 9, backgroundColor: "#EAF4F8", borderWidth: 1, borderColor: "#D7E5EA" },
  buttonDisabled: { opacity: 0.68 },
  icon: { width: 32, height: 32, borderRadius: 11, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.primary },
  label: { flex: 1, color: nwcColors.info, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_800ExtraBold" },
  message: { color: nwcColors.muted, fontSize: 10, lineHeight: 14, fontFamily: "Poppins_600SemiBold" },
});
