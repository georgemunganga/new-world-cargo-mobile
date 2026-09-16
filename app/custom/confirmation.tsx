import { BookingConfirmation } from "@/components/booking/booking-confirmation";
import { useBookingDraft } from "@/stores/booking-draft";

export default function CustomConfirmationScreen() {
  const { resetCustomDraft } = useBookingDraft();
  return (
    <BookingConfirmation
      icon="check"
      title="Custom request received"
      detail="A New WorldCargo team member will review your route and request, then share the right next step."
      onReset={resetCustomDraft}
    />
  );
}
