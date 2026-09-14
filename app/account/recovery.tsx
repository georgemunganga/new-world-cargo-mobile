import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { router, type Href } from "expo-router";
import { AuthPasswordInput } from "@/components/auth/auth-shell";
import { AppIcon } from "@/components/ui/app-icon";
import {
  Card,
  IconButton,
  PrimaryButton,
  SecondaryButton,
  Screen,
} from "@/components/ui/nwc-ui";
import { isValidEmailInput } from "@/lib/auth-flow";
import { nwcColors } from "@/lib/nwc-theme";
import { useCustomerAuth } from "@/stores/customer-auth";

export default function AccountRecoveryScreen() {
  const { authError, changePassword, customer, requestPasswordReset, signOut } =
    useCustomerAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [localMessage, setLocalMessage] = useState("");
  const recoveryEmail = useMemo(
    () => customer?.email?.trim().toLowerCase() ?? "",
    [customer?.email],
  );
  const canRequestReset = isValidEmailInput(recoveryEmail);
  const canChangePassword =
    currentPassword.length >= 8 && nextPassword.length >= 8;
  const sendRecoveryOtp = async () => {
    if (!canRequestReset) {
      setLocalMessage(
        "Add a verified email to your profile before using password recovery.",
      );
      return;
    }
    setLocalMessage("");
    const sent = await requestPasswordReset(recoveryEmail);
    if (sent) {
      setResetSent(true);
      setLocalMessage(
        `A six-digit recovery code was sent to ${recoveryEmail}.`,
      );
    }
  };
  const updatePassword = async () => {
    if (!canChangePassword) return;
    setLocalMessage("");
    const changed = await changePassword(currentPassword, nextPassword);
    if (changed) {
      setPasswordChanged(true);
      setCurrentPassword("");
      setNextPassword("");
      setLocalMessage(
        "Your password was updated. Use the new password next time you sign in.",
      );
    }
  };
  const signOutHere = async () => {
    await signOut();
    router.replace("/auth/phone" as Href);
  };
  return (
    <Screen>
      <View style={styles.page}>
        <View style={styles.header}>
          <IconButton
            label="Go back"
            icon="arrow-left"
            onPress={() => router.back()}
          />
          <Text style={styles.headerTitle}>Account recovery</Text>
          <View style={styles.headerSpacer} />
        </View>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Keep access secure</Text>
            <Text style={styles.detail}>
              Use your verified contact details to recover access, update your
              password, or contact support if something looks wrong.
            </Text>
          </View>
          <Card style={styles.contactCard}>
            <View style={styles.contactIcon}>
              <AppIcon
                name="shield-check-outline"
                size={21}
                color={nwcColors.primaryInk}
              />
            </View>
            <View style={styles.contactCopy}>
              <Text style={styles.contactLabel}>Verified contact</Text>
              <Text style={styles.contactValue}>
                {recoveryEmail ||
                  customer?.phone ||
                  "No verified contact on this profile"}
              </Text>
              <Text style={styles.contactDetail}>
                {recoveryEmail
                  ? "Password reset codes are sent to this verified email."
                  : "Phone sign-in is available, but password reset needs a verified email."}
              </Text>
            </View>
          </Card>
          <Card style={styles.recoveryCard}>
            <Text style={styles.cardTitle}>Recover with an OTP</Text>
            <Text style={styles.cardDetail}>
              {resetSent
                ? "Enter the six-digit code on the reset screen. It expires after 10 minutes."
                : "Send a one-time password code to your verified contact."}
            </Text>
            <SecondaryButton
              label={
                resetSent
                  ? "Send another verification code"
                  : "Send verification code"
              }
              icon="email-outline"
              disabled={!canRequestReset}
              onPress={sendRecoveryOtp}
            />
            <SecondaryButton
              label="Open reset screen"
              onPress={() => router.push("/auth/forgot-password" as Href)}
            />
          </Card>
          <Card style={styles.recoveryCard}>
            <Text style={styles.cardTitle}>Change password</Text>
            <Text style={styles.cardDetail}>
              If you know your current password, update it here without leaving
              your signed-in account.
            </Text>
            <AuthPasswordInput
              label="Current password"
              placeholder="Current password"
              value={currentPassword}
              autoComplete="current-password"
              textContentType="password"
              onChangeText={setCurrentPassword}
            />
            <AuthPasswordInput
              label="New password"
              placeholder="At least 8 characters"
              value={nextPassword}
              autoComplete="new-password"
              textContentType="newPassword"
              onChangeText={setNextPassword}
            />
            <PrimaryButton
              label={passwordChanged ? "Password updated" : "Update password"}
              icon="lock-reset"
              disabled={!canChangePassword}
              onPress={updatePassword}
            />
          </Card>
          <Card style={styles.recoveryCard}>
            <Text style={styles.cardTitle}>This device</Text>
            <Text style={styles.cardDetail}>
              If this phone is shared or lost, sign out here. You can remove
              other recognized devices from Account settings.
            </Text>
            <SecondaryButton
              label="Sign out on this device"
              icon="logout"
              onPress={signOutHere}
            />
          </Card>
          {localMessage || authError ? (
            <Text
              accessibilityRole={authError ? "alert" : "text"}
              style={authError ? styles.error : styles.success}
            >
              {authError || localMessage}
            </Text>
          ) : null}
          <View style={styles.actions}>
            <SecondaryButton
              label="Contact support"
              icon="headset"
              onPress={() => router.push("/support" as Href)}
            />
          </View>
        </ScrollView>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 20,
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
  content: { paddingTop: 24, paddingBottom: 42, gap: 16 },
  titleBlock: { gap: 4 },
  title: {
    color: nwcColors.foreground,
    fontSize: 29,
    lineHeight: 37,
    letterSpacing: -0.5,
    fontFamily: "Poppins_800ExtraBold",
  },
  detail: {
    color: nwcColors.muted,
    fontSize: 13,
    lineHeight: 19,
    fontFamily: "Poppins_500Medium",
  },
  contactCard: {
    minHeight: 82,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F2F8FA",
  },
  contactIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: nwcColors.primary,
  },
  contactCopy: { flex: 1, gap: 1 },
  contactLabel: {
    color: nwcColors.muted,
    fontSize: 10,
    lineHeight: 14,
    fontFamily: "Poppins_600SemiBold",
  },
  contactValue: {
    color: nwcColors.foreground,
    fontSize: 14,
    lineHeight: 19,
    fontFamily: "Poppins_800ExtraBold",
  },
  contactDetail: {
    color: nwcColors.muted,
    fontSize: 11,
    lineHeight: 16,
    fontFamily: "Poppins_500Medium",
  },
  recoveryCard: { gap: 10 },
  cardTitle: {
    color: nwcColors.foreground,
    fontSize: 14,
    lineHeight: 19,
    fontFamily: "Poppins_800ExtraBold",
  },
  cardDetail: {
    color: nwcColors.muted,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Poppins_500Medium",
  },
  success: {
    color: nwcColors.success,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Poppins_700Bold",
    textAlign: "center",
  },
  error: {
    color: nwcColors.error,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Poppins_700Bold",
    textAlign: "center",
  },
  actions: { gap: 10 },
});
