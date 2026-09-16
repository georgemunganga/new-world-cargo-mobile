import { ListSkeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { AppIcon } from "@/components/ui/app-icon";
import { Card, IconButton, PrimaryButton, Screen, SecondaryButton, StatusBadge } from "@/components/ui/nwc-ui";
import { toUiShipment } from "@/lib/mappers/shipment-ui-mapper";
import { statusPresentation } from "@/lib/shipment-status-presentation";
import { CustomerConfirmationDialog } from "@/components/ui/customer-confirmation-dialog";
import { customerSafeMessageFor } from "@/lib/api/errors";
import { repositories } from "@/lib/repositories";
import { nwcColors } from "@/lib/nwc-theme";
import { useCustomerShipment } from "@/lib/use-cases/use-customer-shipment";


export default function ShipmentManagementScreen() {
  const { shipmentId } = useLocalSearchParams<{ shipmentId: string }>();
  const shipmentState = useCustomerShipment(shipmentId);
  const shipment = shipmentState.shipment ? toUiShipment(shipmentState.shipment) : null;
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [cancelling, setCancelling] = useState(false);
  if (!shipment) return <ManageStateScreen status={shipmentState.status} message={shipmentState.errorMessage} onRetry={shipmentState.refresh} />;
  // The server owns eligibility. Never infer it from status locally.
  const allowedActions = shipmentState.shipment?.allowedActions ?? [];
  const canCancel = allowedActions.includes("cancel");
  const cancelShipment = async () => {
    setCancelling(true);
    setCancelError("");
    try {
      await repositories.shipments.performAction(shipment.id, "cancel");
      setConfirmingCancel(false);
      await shipmentState.refresh();
      router.replace(`/shipments/${shipment.id}` as never);
    } catch (error) {
      setCancelError(customerSafeMessageFor(error));
    } finally {
      setCancelling(false);
    }
  };
  return (
    <Screen>
      <View style={styles.page}>
        <View style={styles.header}>
          <IconButton label="Go back" icon="arrow-left" onPress={() => router.back()} />
          <Text style={styles.headerTitle}>Shipment changes</Text>
          <View style={styles.headerSpacer} />
        </View>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.lead}>
            <Text style={styles.title}>Manage delivery</Text>
            <Text style={styles.detail}>Review your cargo and take any action New WorldCargo has made available.</Text>
          </View>
          <Card style={styles.summary}>
            <View style={styles.summaryHead}>
              <View style={styles.summaryIcon}><AppIcon name="truck-fast-outline" size={22} color={nwcColors.primaryInk} /></View>
              <StatusBadge label={shipment.statusLabel ?? statusPresentation[shipment.status].label} tone="info" />
            </View>
            <Text style={styles.summaryTitle}>{shipment.destination.detail}</Text>
            <Text style={styles.summaryDetail}>{shipment.destination.area}, {shipment.destination.city} · {shipment.eta}</Text>
          </Card>

          <Card style={[styles.notice, canCancel ? styles.noticeWarning : styles.noticeNeutral]}>
            <AppIcon name={canCancel ? "alert-circle-outline" : "information-outline"} size={21} color={canCancel ? nwcColors.warning : nwcColors.info} />
            <View style={styles.noticeCopy}>
              <Text style={styles.noticeTitle}>{canCancel ? "Cancellation is available" : "Cancellation unavailable"}</Text>
              <Text style={styles.noticeDetail}>
                {canCancel
                  ? "This shipment can still be cancelled. Cancelling cannot be undone."
                  : "This cargo has moved past the point where it can be cancelled. Contact support if it needs attention."}
              </Text>
            </View>
          </Card>

          {cancelError ? <Text accessibilityRole="alert" style={styles.cancelError}>{cancelError}</Text> : null}

          {canCancel ? (
            <SecondaryButton
              label={cancelling ? "Cancelling..." : "Cancel this shipment"}
              icon="close-circle-outline"
              disabled={cancelling}
              onPress={() => { setCancelError(""); setConfirmingCancel(true); }}
            />
          ) : null}

          <SecondaryButton label="Get support" icon="headset" onPress={() => router.push("/support")} />
        </ScrollView>

        <CustomerConfirmationDialog
          visible={confirmingCancel}
          title="Cancel this shipment?"
          detail="New WorldCargo will stop this cargo request. This cannot be undone."
          approveLabel={cancelling ? "Cancelling..." : "Cancel shipment"}
          tone="danger"
          onDismiss={() => setConfirmingCancel(false)}
          onApprove={() => { void cancelShipment(); }}
        />
      </View>
    </Screen>
  );
}

function ManageStateScreen({ status, message, onRetry }: { status: "idle" | "loading" | "success" | "not-found" | "error"; message?: string; onRetry: () => void }) {
  if (status === "loading" || status === "idle") return <Screen><View style={{padding:20, gap:16}}><IconButton label="Go back" icon="arrow-left" onPress={() => router.back()} /><ListSkeleton kind="shipment" count={2} /></View></Screen>;
  const isError = status === "error";
  const title = isError ? "Shipment changes could not load" : "Shipment not found";
  const detail = isError ? message || "Try again when your connection is stable." : "Check the shipment reference and try again.";
  return <Screen><View style={styles.statePage}><View style={styles.stateIcon}><AppIcon name={isError ? "alert-circle-outline" : "package-variant"} size={30} color={nwcColors.primaryInk} /></View><Text style={styles.stateTitle}>{title}</Text><Text style={styles.stateDetail}>{detail}</Text>{isError ? <PrimaryButton label="Try again" onPress={onRetry} /> : null}</View></Screen>;
}

const styles = StyleSheet.create({
  page: { flex: 1, paddingHorizontal: 20, paddingTop: 16, backgroundColor: nwcColors.background }, header: { minHeight: 44, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, headerTitle: { color: nwcColors.brandNavy, fontSize: 15, lineHeight: 20, fontFamily: "Poppins_800ExtraBold" }, headerSpacer: { width: 44, height: 44 }, content: { paddingTop: 24, paddingBottom: 42, gap: 13 }, lead: { gap: 4 }, eyebrow: { color: nwcColors.muted, fontSize: 10, lineHeight: 14, letterSpacing: 0.6, textTransform: "uppercase", fontFamily: "Poppins_800ExtraBold" }, title: { color: nwcColors.foreground, fontSize: 29, lineHeight: 37, letterSpacing: -0.5, fontFamily: "Poppins_800ExtraBold" }, detail: { color: nwcColors.muted, fontSize: 13, lineHeight: 19, fontFamily: "Poppins_500Medium" }, summary: { padding: 16, gap: 8, backgroundColor: nwcColors.surfaceNavyTint }, summaryHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, summaryIcon: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.primary }, summaryTitle: { color: nwcColors.foreground, fontSize: 17, lineHeight: 23, fontFamily: "Poppins_800ExtraBold" }, summaryDetail: { color: nwcColors.muted, fontSize: 11, lineHeight: 16, fontFamily: "Poppins_500Medium" }, actionCard: { minHeight: 82, padding: 13, flexDirection: "row", gap: 10, alignItems: "center" }, actionIcon: { width: 39, height: 39, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.surfaceNavyTint }, actionCopy: { flex: 1, gap: 2 }, actionTitle: { color: nwcColors.foreground, fontSize: 13, lineHeight: 18, fontFamily: "Poppins_800ExtraBold" }, actionDetail: { color: nwcColors.muted, fontSize: 10, lineHeight: 14, fontFamily: "Poppins_500Medium" }, actionButton: { minHeight: 34, borderRadius: 11, paddingHorizontal: 10, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.surfaceAccent }, actionButtonText: { color: nwcColors.primaryInk, fontSize: 10, lineHeight: 14, fontFamily: "Poppins_800ExtraBold" }, notice: { minHeight: 74, padding: 14, flexDirection: "row", alignItems: "flex-start", gap: 10 }, noticeWarning: { backgroundColor: "#FFF9EA", borderColor: "#F3DE9D" }, noticeNeutral: { backgroundColor: nwcColors.surface }, cancelError: { color: nwcColors.error, fontSize: 12, lineHeight: 18, fontFamily: "Poppins_700Bold" }, noticeCopy: { flex: 1, gap: 2 }, noticeTitle: { color: nwcColors.foreground, fontSize: 13, lineHeight: 18, fontFamily: "Poppins_800ExtraBold" }, noticeDetail: { color: nwcColors.muted, fontSize: 11, lineHeight: 16, fontFamily: "Poppins_500Medium" }, confirmation: { minHeight: 77, padding: 14, flexDirection: "row", gap: 10, alignItems: "center", backgroundColor: "#F0F8F4", borderColor: "#CFE9DB" }, confirmationCopy: { flex: 1, gap: 2 }, confirmationTitle: { color: nwcColors.foreground, fontSize: 13, lineHeight: 18, fontFamily: "Poppins_800ExtraBold" }, confirmationDetail: { color: nwcColors.muted, fontSize: 11, lineHeight: 16, fontFamily: "Poppins_500Medium" }, editor: { gap: 12, padding: 16 }, editorTitle: { color: nwcColors.foreground, fontSize: 17, lineHeight: 23, fontFamily: "Poppins_800ExtraBold" }, input: { minHeight: 100, padding: 12, borderRadius: 16, borderWidth: 1, borderColor: "#DCE6E8", backgroundColor: nwcColors.surfaceElevated, color: nwcColors.foreground, fontSize: 13, lineHeight: 19, fontFamily: "Poppins_500Medium", textAlignVertical: "top" }, editorActions: { flexDirection: "row", gap: 9 }, flexButton: { flex: 1 }, windowList: { gap: 7 }, windowRow: { minHeight: 51, paddingHorizontal: 12, borderRadius: 15, backgroundColor: nwcColors.surface, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, windowSelected: { backgroundColor: nwcColors.surfaceAccent, borderWidth: 1, borderColor: nwcColors.primary }, windowText: { color: nwcColors.foreground, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_700Bold" }, statePage: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 30, gap: 9, backgroundColor: nwcColors.background }, stateIcon: { width: 68, height: 68, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.primary, marginBottom: 6 }, stateTitle: { color: nwcColors.foreground, fontSize: 23, lineHeight: 29, fontFamily: "Poppins_800ExtraBold", textAlign: "center" }, stateDetail: { color: nwcColors.muted, fontSize: 13, lineHeight: 19, fontFamily: "Poppins_500Medium", textAlign: "center" },
});
