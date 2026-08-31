import { router, type Href } from "expo-router";
import { AppStateScreen } from "@/components/system/app-state-screen";
import { mockPaymentPresentation } from "@/lib/mock-billing";
import { useMockBilling } from "@/stores/mock-billing";

export default function PaymentStatusScreen() {
  const { paymentState, setPaymentState } = useMockBilling();
  const state = mockPaymentPresentation(paymentState);
  const goToBill = () => router.replace("/bills" as Href);
  if (paymentState === "pending") return <AppStateScreen {...state} loading primaryLabel="Confirm payment for preview" onPrimary={() => setPaymentState("confirmed")} secondaryLabel="Cancel for preview" onSecondary={() => setPaymentState("cancelled")} />;
  if (paymentState === "confirmed") return <AppStateScreen {...state} primaryLabel="View receipt" onPrimary={() => router.replace("/bills/receipt" as Href)} secondaryLabel="Back to Bills" onSecondary={goToBill} />;
  if (paymentState === "failed") return <AppStateScreen {...state} primaryLabel="Try payment again" onPrimary={() => { setPaymentState("ready"); router.replace("/bills/payment" as Href); }} secondaryLabel="Back to Bills" onSecondary={goToBill} />;
  if (paymentState === "cancelled") return <AppStateScreen {...state} primaryLabel="Return to invoice" onPrimary={() => { setPaymentState("ready"); router.replace("/bills/payment" as Href); }} secondaryLabel="Back to Bills" onSecondary={goToBill} />;
  if (paymentState === "delayed") return <AppStateScreen {...state} primaryLabel="Check confirmation again" onPrimary={() => setPaymentState("confirmed")} secondaryLabel="Back to Bills" onSecondary={goToBill} />;
  if (paymentState === "refunded") return <AppStateScreen {...state} primaryLabel="Back to Bills" onPrimary={goToBill} />;
  return <AppStateScreen {...state} primaryLabel="Review invoice" onPrimary={() => router.replace("/bills/payment" as Href)} secondaryLabel="Back to Bills" onSecondary={goToBill} />;
}
