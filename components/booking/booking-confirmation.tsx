import { useState, type ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams, type Href } from "expo-router";

import { AppIcon, type AppIconName } from "@/components/ui/app-icon";
import { Card, PrimaryButton, Screen, SecondaryButton } from "@/components/ui/nwc-ui";
import { copyTrackingNumber, shareTrackingNumber } from "@/lib/customer-tracking-actions";
import { nwcColors } from "@/lib/nwc-theme";

type BookingConfirmationProps = {
  /** Service badge icon, e.g. "airplane-check" for imports. */
  icon: AppIconName;
  title: string;
  detail: string;
  /** Clears the service draft. Runs before leaving the screen either way. */
  onReset: () => void;
  /**
   * Shared secret the customer gives the courier at handover. Stays hidden
   * until the customer asks for it, so it is not exposed by a glance at the
   * screen. Omitted until the portal contract returns it.
   */
  confirmationId?: string;
  /** Service-specific extra content, e.g. a route summary. */
  children?: ReactNode;
};

export function BookingConfirmation({ icon, title, detail, onReset, confirmationId, children }: BookingConfirmationProps) {
  const params = useLocalSearchParams<{ shipmentId?: string; reference?: string; confirmationCode?: string }>();
  const { shipmentId, reference } = params;
  const code = confirmationId ?? params.confirmationCode;
  const [codeRevealed, setCodeRevealed] = useState(false);
  const [feedback, setFeedback] = useState<string>();

  const leave = (href: Href) => {
    onReset();
    router.replace(href);
  };
  const copy = async () => {
    if (!reference) return;
    setFeedback((await copyTrackingNumber(reference)).message);
  };
  const share = async () => {
    if (!reference) return;
    setFeedback((await shareTrackingNumber(reference)).message);
  };

  return (
    <Screen>
      <View style={styles.screen}>
        <View style={styles.hero}>
          <View style={styles.successIcon}>
            <AppIcon name={icon} size={34} color={nwcColors.primaryInk} />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.detail}>{detail}</Text>
        </View>

        {reference ? (
          <Card style={styles.card}>
            <Text style={styles.cardLabel}>Tracking ID</Text>
            <Text selectable style={styles.tracking}>{reference}</Text>
            <Text style={styles.cardHint}>Use this any time to track your parcel or check its status.</Text>
            <View style={styles.referenceActions}>
              <TouchableOpacity accessibilityRole="button" accessibilityLabel="Copy tracking ID" activeOpacity={0.74} onPress={copy} style={styles.referenceAction}>
                <AppIcon name="content-copy" size={17} color={nwcColors.brandNavy} />
                <Text style={styles.referenceActionText}>Copy</Text>
              </TouchableOpacity>
              <TouchableOpacity accessibilityRole="button" accessibilityLabel="Share tracking ID" activeOpacity={0.74} onPress={share} style={styles.referenceAction}>
                <AppIcon name="share-variant-outline" size={17} color={nwcColors.brandNavy} />
                <Text style={styles.referenceActionText}>Share</Text>
              </TouchableOpacity>
            </View>
            {feedback ? <Text accessibilityRole="alert" style={styles.feedback}>{feedback}</Text> : null}
          </Card>
        ) : null}

        {code ? (
          <Card style={styles.card}>
            <Text style={styles.cardLabel}>Confirmation code</Text>
            {codeRevealed ? (
              <Text selectable style={styles.code}>{code}</Text>
            ) : (
              <Text style={styles.codeHidden}>••••••</Text>
            )}
            <Text style={styles.cardHint}>
              Give this code to the New WorldCargo team member at collection. Only you and New WorldCargo have it.
            </Text>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={codeRevealed ? "Hide confirmation code" : "Reveal confirmation code"}
              accessibilityState={{ expanded: codeRevealed }}
              activeOpacity={0.74}
              onPress={() => setCodeRevealed((shown) => !shown)}
              style={styles.revealAction}
            >
              <AppIcon name={codeRevealed ? "eye-off-outline" : "eye-outline"} size={17} color={nwcColors.primaryInk} />
              <Text style={styles.revealText}>{codeRevealed ? "Hide code" : "Reveal code"}</Text>
            </TouchableOpacity>
          </Card>
        ) : null}

        {children}

        <View style={styles.actions}>
          <PrimaryButton
            label={shipmentId ? "Open shipment" : "View shipments"}
            icon="package-variant-closed"
            onPress={() => leave((shipmentId ? `/shipments/${shipmentId}` : "/shipments") as Href)}
          />
          <SecondaryButton label="Back to Home" onPress={() => leave("/" as Href)} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: nwcColors.background, justifyContent: "center", paddingHorizontal: 24, paddingBottom: 26, gap: 18 },
  hero: { alignItems: "center", gap: 10, marginBottom: 6 },
  successIcon: { width: 78, height: 78, borderRadius: 28, backgroundColor: nwcColors.primary, justifyContent: "center", alignItems: "center", marginBottom: 10 },
  title: { color: nwcColors.foreground, fontSize: 29, lineHeight: 37, fontWeight: "800", letterSpacing: -0.4, textAlign: "center" },
  detail: { color: nwcColors.muted, fontSize: 15, lineHeight: 22, fontWeight: "500", textAlign: "center", maxWidth: 360 },
  card: { gap: 7 },
  cardLabel: { color: nwcColors.muted, fontSize: 12, lineHeight: 16, fontWeight: "800", letterSpacing: 0.5, textTransform: "uppercase" },
  cardHint: { color: nwcColors.muted, fontSize: 12, lineHeight: 18, fontWeight: "600" },
  tracking: { color: nwcColors.foreground, fontSize: 20, lineHeight: 26, fontWeight: "800", letterSpacing: 0.4 },
  code: { color: nwcColors.foreground, fontSize: 26, lineHeight: 33, fontWeight: "800", letterSpacing: 4 },
  codeHidden: { color: nwcColors.muted, fontSize: 26, lineHeight: 33, fontWeight: "800", letterSpacing: 4 },
  referenceActions: { flexDirection: "row", gap: 8, marginTop: 2 },
  referenceAction: { minHeight: 40, flex: 1, borderRadius: 14, backgroundColor: "#F1F5F6", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  referenceActionText: { color: nwcColors.brandNavy, fontSize: 12, lineHeight: 17, fontWeight: "800" },
  revealAction: { minHeight: 42, borderRadius: 14, backgroundColor: nwcColors.primary, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, marginTop: 2 },
  revealText: { color: nwcColors.primaryInk, fontSize: 13, lineHeight: 18, fontWeight: "800" },
  feedback: { color: nwcColors.info, fontSize: 11, lineHeight: 16, fontWeight: "700" },
  actions: { gap: 10, marginTop: 6 },
});
