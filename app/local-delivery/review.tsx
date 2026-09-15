import { PickupScheduleControl } from "@/components/booking/pickup-schedule-control";
import { isPickupTimeValid } from "@/lib/pickup-schedule";
import { ShipmentTicket, ShipmentCharges } from "@/components/booking/shipment-ticket";
import { ShipmentReviewScreen } from "@/components/booking/shipment-review-screen";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router, type Href } from "expo-router";



import { hasCompleteCargoItems } from "@/lib/booking-cargo";


import { nwcColors } from "@/lib/nwc-theme";
import { useSubmitBooking } from "@/lib/use-cases/use-submit-booking";
import { useBookingDraft } from "@/stores/booking-draft";
import { estimateBookingQuote } from "@/lib/booking-pricing";
import { isValidPhoneInput } from "@/lib/auth-flow";

export default function LocalDeliveryReviewScreen() {
  const { localDraft, updateLocalDraft, setBookingStep } = useBookingDraft();
  const submission = useSubmitBooking();
  const detailsComplete = Boolean(localDraft.pickup?.detail && localDraft.destination?.detail &&
    [localDraft.pickup, localDraft.destination].every((point) => Number.isFinite(point?.latitude) && Number.isFinite(point?.longitude)) &&
    localDraft.sender?.name.trim() && localDraft.receiver?.name.trim() &&
    isValidPhoneInput(localDraft.sender?.phone ?? "") && isValidPhoneInput(localDraft.receiver?.phone ?? "") &&
    hasCompleteCargoItems(localDraft.cargoItems ?? []) && (localDraft.schedule === "scheduled" ? isPickupTimeValid(localDraft.scheduledAt) : true));
  const [pricing, setPricing] = useState(true);
  const [priceError, setPriceError] = useState("");
  const [priceVersion, setPriceVersion] = useState(0);
  const latest = useRef({ localDraft, updateLocalDraft });
  latest.current = { localDraft, updateLocalDraft };
  const pricingKey = JSON.stringify({ ...localDraft, quote: undefined });
  useEffect(() => {
    let active = true;
    setPricing(true); setPriceError("");
    void estimateBookingQuote("local", latest.current.localDraft).then((quote) => {
      if (!active) return;
      if (!quote) throw new Error("Price is unavailable. Please retry.");
      latest.current.updateLocalDraft({ quote });
    }).catch((error) => { if (active) setPriceError(error instanceof Error ? error.message : "Could not load price."); })
      .finally(() => { if (active) setPricing(false); });
    return () => { active = false; };
  }, [pricingKey, priceVersion]);
  const edit = (route: "/local-delivery/route" | "/local-delivery/parcel" | "/local-delivery/contacts", step: "route" | "parcel" | "contacts") => { setBookingStep(step); router.push(route as Href); };
  const submit = async () => { if (pricing || !detailsComplete) return; if (localDraft.schedule === "scheduled" && !isPickupTimeValid(localDraft.scheduledAt)) { setPriceError("Your pickup time has passed. Choose a new time or turn scheduling off."); return; } if (priceError || !localDraft.quote || (localDraft.quote.expiresAt && Date.parse(localDraft.quote.expiresAt) <= Date.now())) { setPriceVersion((version) => version + 1); return; } const result = await submission.submit("local", localDraft); if (result) router.replace({ pathname: "/local-delivery/confirmation", params: { shipmentId: result.id, reference: result.reference } } as never); };
  return <ShipmentReviewScreen activeStep="review" title="Review delivery" detail="Check the details before you submit the booking request." continueLabel={pricing ? "Updating price..." : priceError ? "Retry price" : submission.status === "submitting" ? "Submitting..." : "Confirm delivery request"} continueDisabled={!detailsComplete || pricing || submission.status === "submitting"} onContinue={submit} >{!detailsComplete ? <Text accessibilityRole="alert" style={styles.errorText}>Complete the route, cargo, contacts and pickup time using the edit buttons below.</Text> : null}<ShipmentTicket draft={localDraft} onEditRoute={() => edit("/local-delivery/route", "route")} onEditCargo={() => edit("/local-delivery/parcel", "parcel")} onEditContacts={() => edit("/local-delivery/contacts", "contacts")} /><PickupScheduleControl value={localDraft.schedule === "scheduled" ? localDraft.scheduledAt : undefined} onChange={(scheduledAt) => updateLocalDraft({ schedule: scheduledAt ? "scheduled" : "as_soon_as_possible", scheduledAt, quote: undefined })} />{submission.errorMessage ? <Text style={styles.errorText}>{submission.errorMessage}</Text> : null}<ShipmentCharges quote={localDraft.quote} loading={pricing} error={priceError} /><View style={styles.terms}><Text style={styles.termsText}>By continuing, you confirm that the cargo is permitted for local transport and that the pickup and delivery details are accurate.</Text></View></ShipmentReviewScreen>;
}

const styles = StyleSheet.create({ reviewCard: { paddingVertical: 2 }, quoteState: { borderRadius: 18, backgroundColor: "#EAF4F8", padding: 16, gap: 9 }, quoteTitle: { color: nwcColors.foreground, fontSize: 15, lineHeight: 21, fontWeight: "800" }, quoteDetail: { color: nwcColors.info, fontSize: 13, lineHeight: 19, fontWeight: "600" }, errorText: { color: nwcColors.error, fontSize: 12, lineHeight: 18, fontFamily: "Poppins_700Bold" }, terms: { borderRadius: 14, backgroundColor: "#F4F7F8", padding: 14 }, termsText: { color: nwcColors.muted, fontSize: 12, lineHeight: 18, fontWeight: "600" } });




