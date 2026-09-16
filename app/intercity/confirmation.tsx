import { BookingConfirmation } from "@/components/booking/booking-confirmation";
import { useBookingDraft } from "@/stores/booking-draft";

export default function IntercityConfirmationScreen() {
  const { resetIntercityDraft } = useBookingDraft();
  return (
    <BookingConfirmation
      icon="truck-check-outline"
      title="Quote request received"
      detail="We will confirm the next available City-to-City movement and your shipment quote."
      onReset={resetIntercityDraft}
    />
  );
}
