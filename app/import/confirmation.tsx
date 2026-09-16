import { BookingConfirmation } from "@/components/booking/booking-confirmation";
import { useBookingDraft } from "@/stores/booking-draft";

export default function ImportConfirmationScreen() {
  const { resetImportDraft } = useBookingDraft();
  return (
    <BookingConfirmation
      icon="airplane-check"
      title="Import request received"
      detail="We will review your Air or Sea Freight request and share the next step in your shipment."
      onReset={resetImportDraft}
    />
  );
}
