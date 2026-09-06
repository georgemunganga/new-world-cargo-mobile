import { router, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

import { LegalDocumentScreen } from "@/components/account/legal-document-screen";
import { SecondaryButton, Screen } from "@/components/ui/nwc-ui";
import { isLegalDocumentId, legalDocuments } from "@/lib/legal-documents";

export default function LegalDocumentRoute() {
  const { document } = useLocalSearchParams<{ document?: string }>();
  if (isLegalDocumentId(document)) return <LegalDocumentScreen document={legalDocuments[document]} />;
  return <Screen><View style={{ flex: 1, padding: 24, justifyContent: "center", gap: 14 }}><Text style={{ fontSize: 24, fontFamily: "Poppins_800ExtraBold" }}>Policy not found</Text><Text style={{ fontFamily: "Poppins_500Medium" }}>Choose a policy from Account to read the available information.</Text><SecondaryButton label="Back to Account" onPress={() => router.replace("/account" as never)} /></View></Screen>;
}
