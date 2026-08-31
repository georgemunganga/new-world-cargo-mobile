import { router, type Href } from "expo-router";
import { BookingScreen, BookingSection, ChoiceTile } from "@/components/booking/booking-ui";
import { useBookingDraft } from "@/stores/booking-draft";

export default function LocalDeliveryScheduleScreen() {
  const { localDraft, updateLocalDraft, setBookingStep } = useBookingDraft();
  const continueBooking = () => { setBookingStep("review"); router.push("/local-delivery/review" as Href); };
  return <BookingScreen activeStep="schedule" title="When should we collect it?" detail="The exact availability and price will be confirmed before your booking is placed." continueLabel="Review delivery" onContinue={continueBooking}><BookingSection label="Pickup preference"><ChoiceTile title="As soon as possible" detail="Choose the earliest available local pickup." icon="clock-fast" selected={localDraft.schedule === "as_soon_as_possible"} onPress={() => updateLocalDraft({ schedule: "as_soon_as_possible" })} /><ChoiceTile title="Later today" detail="We will show an available time window before confirmation." icon="calendar-clock-outline" selected={localDraft.schedule === "later_today"} onPress={() => updateLocalDraft({ schedule: "later_today" })} /><ChoiceTile title="Choose another day" detail="Set a preferred collection day when scheduling is connected." icon="calendar-outline" selected={localDraft.schedule === "scheduled"} onPress={() => updateLocalDraft({ schedule: "scheduled" })} /></BookingSection></BookingScreen>;
}
