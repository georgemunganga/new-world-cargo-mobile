import { useReviewedBookingQuote } from "@/lib/use-cases/use-reviewed-booking-quote";
import {
  ShipmentTicket,
  ShipmentCharges,
} from "@/components/booking/shipment-ticket";
import { ShipmentReviewScreen } from "@/components/booking/shipment-review-screen";
import { useState } from "react";
import { router } from "expo-router";
import { Text } from "react-native";

import { BookingQuickEditDrawer } from "@/components/booking/booking-quick-edit-drawer";
import { SummaryRow } from "@/components/booking/booking-ui";

import { intercityFulfilmentEditChoices } from "@/lib/booking-review-edits";
import { intercitySteps, isIntercityReady } from "@/lib/service-booking";
import { useSubmitBooking } from "@/lib/use-cases/use-submit-booking";
import { useBookingDraft } from "@/stores/booking-draft";

export default function IntercityReviewScreen() {
  const { intercityDraft, updateIntercityDraft } = useBookingDraft();
  const submission = useSubmitBooking();
  const pricing = useReviewedBookingQuote(
    "intercity",
    intercityDraft,
    updateIntercityDraft,
  );
  const [collectionEditOpen, setCollectionEditOpen] = useState(false);
  const submit = async () => {
    if (!pricing.confirmable()) return;
    const result = await submission.submit(
      "intercity",
      intercityDraft,
      pricing.refresh,
    );
    if (result)
      router.replace({
        pathname: "/intercity/confirmation",
        params: {
          shipmentId: result.id,
          reference: result.reference,
          ...(result.confirmationCode
            ? { confirmationCode: result.confirmationCode }
            : {}),
        },
      } as never);
  };
  return (
    <ShipmentReviewScreen
      activeStep="review"
      serviceLabel="City-to-City"
      progressSteps={intercitySteps}
      title="Review shipment"
      detail="Review the USD price and shipment details before confirming."
      continueLabel={
        pricing.loading
          ? "Updating price..."
          : pricing.error
            ? "Retry price"
            : submission.status === "submitting"
              ? "Submitting..."
              : "Confirm shipment request"
      }
      continueDisabled={
        !isIntercityReady(intercityDraft) ||
        pricing.loading ||
        submission.status === "submitting"
      }
      onContinue={submit}
    >
      <ShipmentTicket
        draft={intercityDraft}
        onEditRoute={() => router.push("/intercity/route" as never)}
        onEditCargo={() => router.push("/intercity/cargo" as never)}
        onEditContacts={() => router.push("/intercity/contacts" as never)}
      />
      <SummaryRow
        label="Collection"
        value={
          intercityDraft.fulfilment === "door_delivery"
            ? "Door delivery"
            : "Collection point"
        }
        onEdit={() => setCollectionEditOpen(true)}
      />
      {intercityDraft.supportingDocument ? (
        <SummaryRow
          label="Document"
          value={intercityDraft.supportingDocument.name}
          onEdit={() => router.push("/intercity/cargo" as never)}
        />
      ) : null}
      <ShipmentCharges
        quote={intercityDraft.quote}
        loading={pricing.loading}
        error={pricing.error}
      />
      {submission.errorMessage ? (
        <Text style={{ color: "#B42318", fontSize: 12, fontWeight: "700" }}>
          {submission.errorMessage}
        </Text>
      ) : null}
      <BookingQuickEditDrawer<"collection" | "door_delivery">
        visible={collectionEditOpen}
        overline="Collection"
        title="Change collection"
        detail="Update this preference without leaving your review."
        value={
          (intercityDraft.fulfilment ?? "collection") as
            | "collection"
            | "door_delivery"
        }
        choices={intercityFulfilmentEditChoices}
        approveLabel="Update collection"
        onDismiss={() => setCollectionEditOpen(false)}
        onApprove={(fulfilment) => {
          updateIntercityDraft({ fulfilment });
          setCollectionEditOpen(false);
        }}
      />
    </ShipmentReviewScreen>
  );
}
