import { router } from "expo-router";
import { CargoItemsForm } from "@/components/booking/cargo-items-form";
import { BookingScreen } from "@/components/booking/booking-ui";
import { blankCargoItem, hasCompleteCargoItems } from "@/lib/booking-cargo";
import { intercitySteps } from "@/lib/service-booking";
import { useBookingDraft } from "@/stores/booking-draft";

export default function IntercityCargoScreen() { const { intercityDraft, updateIntercityDraft } = useBookingDraft(); const items = intercityDraft.cargoItems?.length ? intercityDraft.cargoItems : [blankCargoItem()]; return <BookingScreen activeStep="cargo" serviceLabel="City-to-City" progressSteps={intercitySteps} title="Tell us about the cargo" detail="List items and add proof only when it is useful." continueLabel="Continue to contacts" continueDisabled={!hasCompleteCargoItems(items)} onContinue={() => router.push("/intercity/contacts" as never)}><CargoItemsForm service="intercity" items={items} description={intercityDraft.cargoDescription} photos={intercityDraft.cargoPhotos} supportingDocument={intercityDraft.supportingDocument} onChangeItems={(cargoItems) => updateIntercityDraft({ cargoItems, cargoCategory: cargoItems[0]?.name.trim() ? "cargo_items" : undefined, quantity: cargoItems.reduce((sum, item) => sum + item.quantity, 0) })} onChangeDescription={(cargoDescription) => updateIntercityDraft({ cargoDescription })} onChangePhotos={(cargoPhotos) => updateIntercityDraft({ cargoPhotos })} onChangeSupportingDocument={(supportingDocument) => updateIntercityDraft({ supportingDocument })} /></BookingScreen>; }
