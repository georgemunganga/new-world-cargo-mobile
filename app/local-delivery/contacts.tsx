import { router, type Href } from "expo-router";
import { BookingScreen, BookingSection, FormField, OptionalDetails } from "@/components/booking/booking-ui";
import { useBookingDraft } from "@/stores/booking-draft";
import { recipientToBookingContact } from "@/lib/account-directory-booking";
import { useMockAccountDirectory } from "@/stores/mock-account-directory";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { nwcColors } from "@/lib/nwc-theme";
import { isContactsReady } from "@/lib/booking-progress";

export default function LocalDeliveryContactsScreen() {
  const { localDraft, updateLocalDraft, setBookingStep } = useBookingDraft();
  const { recipients } = useMockAccountDirectory();
  const sender = localDraft.sender ?? { name: "", phone: "" };
  const receiver = localDraft.receiver ?? { name: "", phone: "" };
  const ready = isContactsReady({ ...localDraft, sender, receiver });
  const continueBooking = () => { setBookingStep("schedule"); router.push("/local-delivery/schedule" as Href); };
  return <BookingScreen activeStep="contacts" title="Who sends and receives it?" detail="We use these essentials to coordinate pickup and delivery." continueLabel="Continue to schedule" onContinue={continueBooking} continueDisabled={!ready}><BookingSection label="Sender"><FormField label="Your name" icon="account-outline" placeholder="Full name" value={sender.name} onChangeText={(name) => updateLocalDraft({ sender: { ...sender, name } })} /><FormField label="Your phone number" icon="phone-outline" placeholder="+260 …" keyboardType="phone-pad" value={sender.phone} onChangeText={(phone) => updateLocalDraft({ sender: { ...sender, phone } })} /></BookingSection><BookingSection label="Receiver"><View style={styles.recipientHeader}><Text style={styles.savedLabel}>Saved recipients</Text><Text style={styles.savedHint}>Optional</Text></View><View style={styles.recipientChips}>{recipients.slice(0, 3).map((recipient) => <TouchableOpacity key={recipient.id} accessibilityRole="button" accessibilityLabel={`Use ${recipient.label} as recipient`} onPress={() => updateLocalDraft({ receiver: recipientToBookingContact(recipient) })} style={styles.recipientChip}><Text style={styles.recipientChipText}>{recipient.label}</Text></TouchableOpacity>)}</View><FormField label="Receiver name" icon="account-outline" placeholder="Full name" value={receiver.name} onChangeText={(name) => updateLocalDraft({ receiver: { ...receiver, name } })} /><FormField label="Receiver phone number" icon="phone-outline" placeholder="+260 …" keyboardType="phone-pad" value={receiver.phone} onChangeText={(phone) => updateLocalDraft({ receiver: { ...receiver, phone } })} /></BookingSection><OptionalDetails label="Add delivery instructions"><FormField label="Instructions" icon="note-text-outline" placeholder="Entrance, landmark, or call on arrival" value={localDraft.deliveryInstructions ?? ""} onChangeText={(deliveryInstructions) => updateLocalDraft({ deliveryInstructions })} multiline /></OptionalDetails></BookingScreen>;
}

const styles = StyleSheet.create({
  recipientHeader: { marginBottom: -4, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, savedLabel: { color: nwcColors.foreground, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_800ExtraBold" }, savedHint: { color: nwcColors.muted, fontSize: 10, lineHeight: 14, fontFamily: "Poppins_600SemiBold" }, recipientChips: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginBottom: 2 }, recipientChip: { minHeight: 33, paddingHorizontal: 10, borderRadius: 11, justifyContent: "center", backgroundColor: nwcColors.surfaceNavyTint }, recipientChipText: { color: nwcColors.brandNavy, fontSize: 11, lineHeight: 15, fontFamily: "Poppins_700Bold" },
});
