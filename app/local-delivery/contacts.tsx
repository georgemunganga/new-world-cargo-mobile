import { router, type Href } from "expo-router";
import { BookingScreen, BookingSection, FormField } from "@/components/booking/booking-ui";
import { useBookingDraft } from "@/stores/booking-draft";
import { isContactsReady } from "@/lib/booking-progress";

export default function LocalDeliveryContactsScreen() {
  const { localDraft, updateLocalDraft, setBookingStep } = useBookingDraft();
  const sender = localDraft.sender ?? { name: "", phone: "" };
  const receiver = localDraft.receiver ?? { name: "", phone: "" };
  const ready = isContactsReady({ ...localDraft, sender, receiver });
  const continueBooking = () => { setBookingStep("schedule"); router.push("/local-delivery/schedule" as Href); };
  return <BookingScreen activeStep="contacts" title="Who sends and receives it?" detail="We use these details to coordinate pickup and delivery." continueLabel="Continue to schedule" onContinue={continueBooking} continueDisabled={!ready}><BookingSection label="Sender"><FormField label="Your name" icon="account-outline" placeholder="Full name" value={sender.name} onChangeText={(name) => updateLocalDraft({ sender: { ...sender, name } })} /><FormField label="Your phone number" icon="phone-outline" placeholder="+260 …" keyboardType="phone-pad" value={sender.phone} onChangeText={(phone) => updateLocalDraft({ sender: { ...sender, phone } })} /></BookingSection><BookingSection label="Receiver"><FormField label="Receiver name" icon="account-outline" placeholder="Full name" value={receiver.name} onChangeText={(name) => updateLocalDraft({ receiver: { ...receiver, name } })} /><FormField label="Receiver phone number" icon="phone-outline" placeholder="+260 …" keyboardType="phone-pad" value={receiver.phone} onChangeText={(phone) => updateLocalDraft({ receiver: { ...receiver, phone } })} /><FormField label="Delivery instructions" icon="note-text-outline" placeholder="Building entrance, landmark, or call on arrival" value={localDraft.deliveryInstructions ?? ""} onChangeText={(deliveryInstructions) => updateLocalDraft({ deliveryInstructions })} multiline /></BookingSection></BookingScreen>;
}
