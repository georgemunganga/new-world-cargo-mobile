import { router, type Href } from "expo-router";
import { CargoItemsForm } from "@/components/booking/cargo-items-form";
import { BookingScreen } from "@/components/booking/booking-ui";
import { blankCargoItem, hasCompleteCargoItems } from "@/lib/booking-cargo";
import { useBookingDraft } from "@/stores/booking-draft";

export default function LocalDeliveryParcelScreen() {
  const { localDraft, updateLocalDraft, setBookingStep } = useBookingDraft();
  const items = localDraft.cargoItems?.length ? localDraft.cargoItems : [blankCargoItem()];
  const continueBooking = () => { setBookingStep("contacts"); router.push("/local-delivery/contacts" as Href); };
  return <BookingScreen activeStep="parcel" title="Tell us about the cargo" detail="List items, then add optional photos or proof if useful." continueLabel="Continue to contacts" onContinue={continueBooking} continueDisabled={!hasCompleteCargoItems(items)}><CargoItemsForm service="local" items={items} description={localDraft.cargoDescription} photos={localDraft.cargoPhotos} supportingDocument={localDraft.supportingDocument} onChangeItems={(cargoItems) => updateLocalDraft({ cargoItems, parcelCategory: cargoItems[0]?.name.trim() ? "cargo_items" : undefined, parcelDescription: cargoItems[0]?.name, quantity: cargoItems.reduce((sum, item) => sum + item.quantity, 0) })} onChangeDescription={(cargoDescription) => updateLocalDraft({ cargoDescription })} onChangePhotos={(cargoPhotos) => updateLocalDraft({ cargoPhotos })} onChangeSupportingDocument={(supportingDocument) => updateLocalDraft({ supportingDocument })} /></BookingScreen>;
}
