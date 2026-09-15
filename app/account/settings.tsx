import { ListSkeleton } from "@/components/ui/skeleton";
import { MobileInput } from "@/components/ui/mobile-input";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";

import { FullScreenFormDrawer } from "@/components/account/full-screen-form-drawer";
import { CustomerConfirmationDialog } from "@/components/ui/customer-confirmation-dialog";
import { AppIcon, type AppIconName } from "@/components/ui/app-icon";
import { Card, IconButton, Screen, StatusBadge } from "@/components/ui/nwc-ui";
import { accountPolicySummaries } from "@/lib/domain/account-settings";
import {
  getCustomerApprovalPresentation,
  type CustomerApprovalKind,
} from "@/lib/customer-approval";
import { nwcColors } from "@/lib/nwc-theme";
import { cameraService } from "@/lib/services/device/camera-service";
import { useAccountSettings } from "@/lib/use-cases/use-account-settings";
import { useProfilePhoto } from "@/lib/use-cases/use-profile-photo";
import { useCustomerAuth } from "@/stores/customer-auth";

type SettingsSheet =
  | "profile"
  | "photo"
  | "password"
  | "devices"
  | "data"
  | "policies"
  | null;
type PendingApproval = {
  kind: CustomerApprovalKind;
  subject?: string;
  id?: string;
} | null;

export default function AccountSettingsScreen() {
  const { authError, changePassword, customer, updateProfile } =
    useCustomerAuth();
  const profilePhoto = useProfilePhoto();
  const {
    devices,
    marketingEnabled,
    dataExportRequested,
    deletionRequested,
    status: settingsStatus,
    errorMessage: settingsError,
    revokeDevice,
    setMarketingEnabled,
    requestDataExport,
    requestAccountDeletion,
  } = useAccountSettings();
  const [sheet, setSheet] = useState<SettingsSheet>(null);
  const [name, setName] = useState(customer?.name ?? "New WorldCargo customer");
  const [phone, setPhone] = useState(customer?.phone ?? "+260");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [photoMessage, setPhotoMessage] = useState("");
  const [pendingApproval, setPendingApproval] = useState<PendingApproval>(null);
  const close = () => setSheet(null);
  const openProfile = () => {
    setName(customer?.name ?? "New WorldCargo customer");
    setPhone(customer?.phone ?? "+260");
    setProfileSaved(false);
    setSheet("profile");
  };
  const openPassword = () => {
    setCurrentPassword("");
    setNewPassword("");
    setPasswordUpdated(false);
    setSheet("password");
  };
  const approveProfile = async () => {
    await updateProfile({ name, phone });
    setProfileSaved(true);
  };
  const approvePassword = async () => {
    const changed = await changePassword(currentPassword, newPassword);
    if (changed) setPasswordUpdated(true);
  };
  const chooseProfilePhoto = async () => {
    setPhotoMessage("");
    const result = await cameraService.pickImage();
    if (result.ok) {
      await profilePhoto.upload(result.value);
      return;
    }
    setPhotoMessage(result.message);
  };
  const approval = pendingApproval
    ? getCustomerApprovalPresentation(
        pendingApproval.kind,
        pendingApproval.subject,
      )
    : getCustomerApprovalPresentation("data-export");
  const approvePendingAction = () => {
    if (pendingApproval?.kind === "remove-device" && pendingApproval.id)
      revokeDevice(pendingApproval.id);
    if (pendingApproval?.kind === "data-export") requestDataExport();
    if (pendingApproval?.kind === "account-deletion") requestAccountDeletion();
    setPendingApproval(null);
  };
  const avatarPreview =
    profilePhoto.document?.url ||
    profilePhoto.document?.id ||
    customer?.avatarUrl;
  return (
    <Screen>
      <View style={styles.page}>
        <View style={styles.header}>
          <IconButton
            label="Go back"
            icon="arrow-left"
            onPress={() => router.back()}
          />
          <Text style={styles.headerTitle}>Account settings</Text>
          <View style={styles.headerSpacer} />
        </View>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.lead}>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.detail}>
              Manage your profile, security, and data from one place.
            </Text>
          </View>
          <SettingsGroup label="Account">
            <SettingsRow
              icon="account-outline"
              title="Personal details"
              detail="Name and phone number"
              onPress={openProfile}
            />
            <SettingsRow
              icon="camera-outline"
              title="Profile photo"
              detail={
                profilePhoto.document
                  ? "Photo uploaded"
                  : "Add or replace your account photo"
              }
              onPress={() => setSheet("photo")}
            />
            <SettingsRow
              icon="lock-outline"
              title="Password & recovery"
              detail="Change access details"
              onPress={openPassword}
            />
          </SettingsGroup>
          <SettingsGroup label="Security">
            <SettingsRow
              icon="shield-check-outline"
              title="Sign-in activity"
              detail={settingsStatus === "loading" ? "Checking devices" : `${devices.length} recognized devices`}
              onPress={() => setSheet("devices")}
            />
          </SettingsGroup>
          <SettingsGroup label="Data and policies">
            <SettingsRow
              icon="database-outline"
              title="Data controls"
              detail="Export, communication, and deletion"
              onPress={() => setSheet("data")}
            />
            <SettingsRow
              icon="file-document-outline"
              title="Terms & policies"
              detail="Privacy, payments, and refunds"
              onPress={() => setSheet("policies")}
            />
          </SettingsGroup>
        </ScrollView>
        <FullScreenFormDrawer
          visible={sheet === "profile"}
          overline="Account"
          title="Personal details"
          detail="Keep your contact information current for cargo updates."
          approveLabel={profileSaved ? "Saved" : "Approve changes"}
          approveDisabled={!name.trim() || !phone.trim()}
          onDismiss={close}
          onApprove={approveProfile}
          footerNote={
            profileSaved ? (
              <Text style={styles.successNote}>
                Your profile changes have been saved.
              </Text>
            ) : null
          }
        >
          <SettingsInput
            label="Full name"
            value={name}
            onChangeText={setName}
            placeholder="Your name"
          />
          <SettingsInput
            label="Phone number"
            value={phone}
            onChangeText={setPhone}
            placeholder="+260 ..."
            keyboardType="phone-pad"
          />
        </FullScreenFormDrawer>
        <FullScreenFormDrawer
          visible={sheet === "photo"}
          overline="Account"
          title="Profile photo"
          detail="Upload a customer photo to your account."
          approveLabel={
            profilePhoto.status === "uploading"
              ? "Uploading…"
              : profilePhoto.status === "success"
                ? "Choose another photo"
                : "Choose photo"
          }
          approveDisabled={profilePhoto.status === "uploading"}
          onDismiss={close}
          onApprove={chooseProfilePhoto}
          footerNote={
            profilePhoto.errorMessage ? (
              <Text style={styles.errorNote}>{profilePhoto.errorMessage}</Text>
            ) : profilePhoto.document ? (
              <Text style={styles.successNote}>
                {profilePhoto.document.filename} was uploaded.
              </Text>
            ) : (
              <Text style={styles.footerHint}>
                {photoMessage || "Choose a photo from your device."}
              </Text>
            )
          }
        >
          <View style={styles.photoPreview}>
            <View style={styles.photoCircle}>
              {avatarPreview ? (
                <Image
                  source={{ uri: avatarPreview }}
                  resizeMode="cover"
                  style={styles.photoImage}
                />
              ) : (
                <AppIcon
                  name="account-outline"
                  size={34}
                  color={nwcColors.brandNavy}
                />
              )}
            </View>
            <Text style={styles.photoTitle}>
              {customer?.name ?? "New WorldCargo customer"}
            </Text>
            <Text style={styles.photoDetail}>
              {profilePhoto.document?.filename ??
                "No profile photo selected yet"}
            </Text>
            {profilePhoto.document ? (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Remove profile photo"
                onPress={profilePhoto.clear}
                style={styles.removePhoto}
              >
                <AppIcon
                  name="trash-can-outline"
                  size={17}
                  color={nwcColors.error}
                />
                <Text style={styles.removeText}>Remove photo</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </FullScreenFormDrawer>
        <FullScreenFormDrawer
          visible={sheet === "password"}
          overline="Security"
          title="Change password"
          detail="Use a unique password for your NewWorld Cargo account."
          approveLabel={
            passwordUpdated ? "Password updated" : "Approve password"
          }
          approveDisabled={!currentPassword || newPassword.length < 8}
          onDismiss={close}
          onApprove={approvePassword}
          footerNote={
            passwordUpdated ? (
              <Text style={styles.successNote}>
                Your password has been updated.
              </Text>
            ) : authError ? (
              <Text style={styles.errorNote}>{authError}</Text>
            ) : (
              <Text style={styles.footerHint}>
                Your password is securely sent to your account service.
              </Text>
            )
          }
        >
          <SettingsInput
            label="Current password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Enter current password"
            secureTextEntry
          />
          <SettingsInput
            label="New password"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Create a new password"
            secureTextEntry
          />
        </FullScreenFormDrawer>
        <FullScreenFormDrawer
          visible={sheet === "devices"}
          overline="Security"
          title="Sign-in activity"
          detail="Remove devices you no longer recognize."
          approveLabel="Done"
          onDismiss={close}
          onApprove={close}
        >
          <View style={styles.drawerList}>
            {settingsStatus === "loading" ? <ListSkeleton count={2} /> : null}
            {devices.map((device) => (
              <Card key={device.id} style={styles.deviceRow}>
                <View style={styles.deviceIcon}>
                  <AppIcon
                    name={device.current ? "cellphone" : "laptop"}
                    size={20}
                    color={nwcColors.brandNavy}
                  />
                </View>
                <View style={styles.deviceCopy}>
                  <View style={styles.deviceTitleLine}>
                    <Text style={styles.deviceTitle}>{device.name}</Text>
                    {device.current ? (
                      <StatusBadge label="Current" tone="success" />
                    ) : null}
                  </View>
                  <Text style={styles.deviceDetail}>{device.detail}</Text>
                </View>
                {device.current ? null : (
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={`Remove ${device.name}`}
                    onPress={() =>
                      setPendingApproval({
                        kind: "remove-device",
                        subject: device.name,
                        id: device.id,
                      })
                    }
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeText}>Remove</Text>
                  </TouchableOpacity>
                )}
              </Card>
            ))}
          </View>
        </FullScreenFormDrawer>
        <FullScreenFormDrawer
          visible={sheet === "data"}
          overline="Privacy"
          title="Data controls"
          detail="Choose how your account data and communications are handled."
          approveLabel={
            settingsStatus === "updating"
              ? "Saving…"
              : deletionRequested
                ? "Request received"
                : "Done"
          }
          approveDisabled={settingsStatus === "updating"}
          onDismiss={close}
          onApprove={close}
          footerNote={
            settingsError ? (
              <Text style={styles.errorNote}>{settingsError}</Text>
            ) : (
              <Text style={styles.footerHint}>
                These settings are saved to your NewWorld Cargo account.
              </Text>
            )
          }
        >
          <Card style={styles.controlCard}>
            <View style={styles.controlCopy}>
              <Text style={styles.controlTitle}>Cargo updates and offers</Text>
              <Text style={styles.controlDetail}>
                Receive service messages and relevant delivery offers.
              </Text>
            </View>
            <Switch
              accessibilityLabel="Receive cargo updates and offers"
              disabled={settingsStatus === "updating"}
              value={marketingEnabled}
              onValueChange={setMarketingEnabled}
              trackColor={{ false: "#D4E0E4", true: nwcColors.primary }}
              thumbColor={nwcColors.white}
            />
          </Card>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Request account data export"
            disabled={settingsStatus === "updating" || dataExportRequested}
            onPress={() => setPendingApproval({ kind: "data-export" })}
            style={styles.controlAction}
          >
            <View>
              <Text style={styles.controlTitle}>Export your data</Text>
              <Text style={styles.controlDetail}>
                {dataExportRequested
                  ? "Request received"
                  : "Receive a copy of your account data"}
              </Text>
            </View>
            <AppIcon
              name={dataExportRequested ? "check-circle" : "download-outline"}
              size={22}
              color={
                dataExportRequested ? nwcColors.success : nwcColors.brandNavy
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Request account deletion"
            disabled={settingsStatus === "updating" || deletionRequested}
            onPress={() => setPendingApproval({ kind: "account-deletion" })}
            style={[styles.controlAction, styles.dangerAction]}
          >
            <View>
              <Text style={styles.dangerTitle}>Request account deletion</Text>
              <Text style={styles.controlDetail}>
                {deletionRequested
                  ? "Request received"
                  : "Ask support to close this account"}
              </Text>
            </View>
            <AppIcon
              name="alert-circle-outline"
              size={22}
              color={nwcColors.error}
            />
          </TouchableOpacity>
        </FullScreenFormDrawer>
        <FullScreenFormDrawer
          visible={sheet === "policies"}
          overline="Policies"
          title="Terms & policies"
          detail="Clear rules for your account, cargo, and payments."
          approveLabel="Done"
          onDismiss={close}
          onApprove={close}
        >
          <View style={styles.drawerList}>
            {accountPolicySummaries.map((policy) => (
              <TouchableOpacity
                key={policy.id}
                accessibilityRole="button"
                accessibilityLabel={`Read ${policy.title}`}
                accessibilityHint={policy.detail}
                onPress={() =>
                  router.push(`/account/legal/${policy.id}` as never)
                }
                activeOpacity={0.74}
              >
                <Card style={styles.policyCard}>
                  <AppIcon
                    name="file-document-outline"
                    size={22}
                    color={nwcColors.brandNavy}
                  />
                  <View style={styles.policyCopy}>
                    <Text style={styles.policyTitle}>{policy.title}</Text>
                    <Text style={styles.policyDetail}>{policy.detail}</Text>
                  </View>
                  <AppIcon
                    name="chevron-right"
                    size={20}
                    color={nwcColors.muted}
                  />
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </FullScreenFormDrawer>
        <CustomerConfirmationDialog
          visible={Boolean(pendingApproval)}
          {...approval}
          onDismiss={() => setPendingApproval(null)}
          onApprove={approvePendingAction}
        />
      </View>
    </Screen>
  );
}

function SettingsGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupLabel}>{label}</Text>
      <Card style={styles.groupCard}>{children}</Card>
    </View>
  );
}
function SettingsRow({
  icon,
  title,
  detail,
  onPress,
}: {
  icon: AppIconName;
  title: string;
  detail: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={detail}
      onPress={onPress}
      activeOpacity={0.72}
      style={styles.row}
    >
      <View style={styles.rowIcon}>
        <AppIcon name={icon} size={20} color={nwcColors.brandNavy} />
      </View>
      <View style={styles.rowCopy}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDetail}>{detail}</Text>
      </View>
      <AppIcon name="chevron-right" size={20} color={nwcColors.muted} />
    </TouchableOpacity>
  );
}
function SettingsInput({
  label,
  ...props
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "phone-pad";
}) {
  return <MobileInput {...props} label={label} returnKeyType="done" />;
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: nwcColors.background,
  },
  header: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: nwcColors.brandNavy,
    fontSize: 15,
    lineHeight: 20,
    fontFamily: "Poppins_800ExtraBold",
  },
  headerSpacer: { width: 44, height: 44 },
  content: { paddingTop: 24, paddingBottom: 42, gap: 20 },
  lead: { gap: 4 },
  title: {
    color: nwcColors.foreground,
    fontSize: 29,
    lineHeight: 37,
    fontFamily: "Poppins_800ExtraBold",
    letterSpacing: -0.5,
  },
  detail: {
    color: nwcColors.muted,
    fontSize: 13,
    lineHeight: 19,
    fontFamily: "Poppins_500Medium",
  },
  group: { gap: 8 },
  groupLabel: {
    color: nwcColors.foreground,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "Poppins_800ExtraBold",
  },
  groupCard: { paddingVertical: 0, paddingHorizontal: 13 },
  row: { minHeight: 70, flexDirection: "row", alignItems: "center", gap: 11 },
  rowIcon: {
    width: 39,
    height: 39,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: nwcColors.surfaceNavyTint,
  },
  rowCopy: { flex: 1, gap: 1 },
  rowTitle: {
    color: nwcColors.foreground,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "Poppins_800ExtraBold",
  },
  rowDetail: {
    color: nwcColors.muted,
    fontSize: 11,
    lineHeight: 16,
    fontFamily: "Poppins_500Medium",
  },
  inputGroup: { gap: 6 },
  inputLabel: {
    color: nwcColors.foreground,
    fontSize: 12,
    lineHeight: 17,
    fontFamily: "Poppins_800ExtraBold",
  },
  input: {
    minHeight: 50,
    paddingHorizontal: 13,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DCE6E8",
    backgroundColor: nwcColors.surfaceElevated,
    color: nwcColors.foreground,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "Poppins_600SemiBold",
  },
  successNote: {
    color: nwcColors.success,
    fontSize: 11,
    lineHeight: 16,
    fontFamily: "Poppins_700Bold",
    textAlign: "center",
  },
  errorNote: {
    color: nwcColors.error,
    fontSize: 11,
    lineHeight: 16,
    fontFamily: "Poppins_700Bold",
    textAlign: "center",
  },
  footerHint: {
    color: nwcColors.muted,
    fontSize: 10,
    lineHeight: 15,
    fontFamily: "Poppins_500Medium",
    textAlign: "center",
  },
  photoPreview: { alignItems: "center", gap: 8, paddingVertical: 10 },
  photoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: nwcColors.primary,
    borderWidth: 3,
    borderColor: nwcColors.surface,
  },
  photoImage: { width: "100%", height: "100%" },
  photoTitle: {
    color: nwcColors.foreground,
    fontSize: 15,
    lineHeight: 21,
    fontFamily: "Poppins_800ExtraBold",
  },
  photoDetail: {
    color: nwcColors.muted,
    fontSize: 11,
    lineHeight: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  removePhoto: {
    minHeight: 38,
    borderRadius: 13,
    paddingHorizontal: 12,
    backgroundColor: "#FFF0F0",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  drawerList: { gap: 9 },
  deviceRow: {
    minHeight: 72,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  deviceIcon: {
    width: 39,
    height: 39,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: nwcColors.surfaceNavyTint,
  },
  deviceCopy: { flex: 1, gap: 2 },
  deviceTitleLine: { flexDirection: "row", alignItems: "center", gap: 6 },
  deviceTitle: {
    color: nwcColors.foreground,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "Poppins_800ExtraBold",
  },
  deviceDetail: {
    color: nwcColors.muted,
    fontSize: 10,
    lineHeight: 14,
    fontFamily: "Poppins_500Medium",
  },
  removeButton: {
    minHeight: 34,
    borderRadius: 11,
    paddingHorizontal: 9,
    justifyContent: "center",
    backgroundColor: "#FFF0F0",
  },
  removeText: {
    color: nwcColors.error,
    fontSize: 10,
    lineHeight: 14,
    fontFamily: "Poppins_800ExtraBold",
  },
  controlCard: {
    minHeight: 86,
    padding: 14,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  controlCopy: { flex: 1, gap: 2 },
  controlTitle: {
    color: nwcColors.foreground,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "Poppins_800ExtraBold",
  },
  controlDetail: {
    color: nwcColors.muted,
    fontSize: 11,
    lineHeight: 16,
    fontFamily: "Poppins_500Medium",
  },
  controlAction: {
    minHeight: 74,
    padding: 13,
    borderRadius: 20,
    backgroundColor: nwcColors.surface,
    borderWidth: 1,
    borderColor: "#E2EAEC",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dangerAction: { backgroundColor: "#FFF8F8", borderColor: "#F1D4D4" },
  dangerTitle: {
    color: nwcColors.error,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "Poppins_800ExtraBold",
  },
  policyCard: {
    minHeight: 79,
    padding: 14,
    flexDirection: "row",
    gap: 11,
    alignItems: "flex-start",
  },
  policyCopy: { flex: 1, gap: 2 },
  policyTitle: {
    color: nwcColors.foreground,
    fontSize: 14,
    lineHeight: 19,
    fontFamily: "Poppins_800ExtraBold",
  },
  policyDetail: {
    color: nwcColors.muted,
    fontSize: 11,
    lineHeight: 16,
    fontFamily: "Poppins_500Medium",
  },
});
