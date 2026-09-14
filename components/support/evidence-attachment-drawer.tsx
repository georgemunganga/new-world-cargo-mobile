import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { FullScreenFormDrawer } from "@/components/account/full-screen-form-drawer";
import { AppIcon } from "@/components/ui/app-icon";
import { Card, SecondaryButton } from "@/components/ui/nwc-ui";
import { nwcColors } from "@/lib/nwc-theme";
import { fileService, type PickedDocument } from "@/lib/services/device/file-service";
import { useSupportEvidence } from "@/lib/use-cases/use-support-evidence";

type EvidenceAttachmentDrawerProps = { visible: boolean; caseId?: string; caseTitle: string; onDismiss: () => void; onAttached: (name: string) => void };
const mockEvidence = ["delivery-photo.jpg", "receipt-screenshot.png", "cargo-label.jpg"];
const developmentEvidenceDataUri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/6XxWioAAAAASUVORK5CYII=";

export function EvidenceAttachmentDrawer({ visible, caseId, caseTitle, onDismiss, onAttached }: EvidenceAttachmentDrawerProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<PickedDocument | null>(null);
  const [attached, setAttached] = useState(false);
  const [deviceMessage, setDeviceMessage] = useState("");
  const evidence = useSupportEvidence();
  useEffect(() => { if (visible) { setSelected(null); setSelectedFile(null); setAttached(false); evidence.reset(); } }, [visible]);
  const approve = async () => {
    if (!selected || !caseId) return;
    if (selectedFile) {
      const uploaded = await evidence.uploadEvidence(caseId, {
        uri: selectedFile.uri,
        name: selectedFile.name,
        type: selectedFile.type ?? "application/octet-stream",
        size: selectedFile.size,
      });
      if (!uploaded) return;
      setAttached(true);
      onAttached(uploaded.filename);
      return;
    }
    if (__DEV__) {
      const uploaded = await evidence.uploadEvidence(caseId, {
        uri: developmentEvidenceDataUri,
        name: selected,
        type: "image/png",
        size: 68,
      });
      if (!uploaded) return;
      setAttached(true);
      onAttached(uploaded.filename);
    }
  };
  const chooseDeviceFile = async () => {
    const result = await fileService.pickDocument();
    if (result.ok) {
      setSelected(result.value.name);
      setSelectedFile(result.value);
      setAttached(false);
      setDeviceMessage("Device file selected.");
      return;
    }
    setDeviceMessage(result.message);
  };
  return <FullScreenFormDrawer visible={visible} overline="Support evidence" title="Attach evidence" detail={`Add one file to ${caseTitle}.`} approveLabel={attached ? "Evidence attached" : evidence.status === "uploading" ? "Uploading evidence" : "Attach evidence"} approveDisabled={!caseId || !selected || attached || evidence.status === "uploading"} onDismiss={onDismiss} onApprove={approve} footerNote={attached ? <Text style={styles.success}>Evidence added to this case.</Text> : <Text style={evidence.errorMessage ? styles.error : styles.note}>{evidence.errorMessage || deviceMessage || (!caseId ? "Open a saved support case before attaching evidence." : "Choose a file from this device when attachments are needed.")}</Text>}><Card style={styles.explainer}><View style={styles.explainerIcon}><AppIcon name="paperclip" size={22} color={nwcColors.primaryInk} /></View><View style={styles.explainerCopy}><Text style={styles.explainerTitle}>Choose a file</Text><Text style={styles.explainerDetail}>Photos, delivery labels, or payment evidence can be uploaded for support review.</Text></View></Card><SecondaryButton label="Choose from device" icon="file-upload-outline" onPress={chooseDeviceFile} />{__DEV__ ? <View style={styles.files}>{mockEvidence.map((file) => <TouchableOpacity key={file} accessibilityRole="button" accessibilityState={{ selected: selected === file }} accessibilityLabel={`Choose ${file}`} onPress={() => { setSelected(file); setSelectedFile(null); setAttached(false); setDeviceMessage(""); evidence.reset(); }} style={[styles.file, selected === file && styles.fileSelected]}><View style={styles.fileIcon}><AppIcon name={file.endsWith("png") ? "image-outline" : "file-image-outline"} size={20} color={nwcColors.brandNavy} /></View><View style={styles.fileCopy}><Text style={styles.fileName}>{file}</Text><Text style={styles.fileDetail}>{selected === file ? attached ? "Attached · 100%" : "Ready to attach · 0%" : "Development sample upload"}</Text></View>{selected === file ? <AppIcon name={attached ? "check-circle" : "circle-outline"} size={20} color={attached ? nwcColors.success : nwcColors.info} /> : null}</TouchableOpacity>)}</View> : null}{selected && !attached ? <SecondaryButton label="Remove selected file" icon="close" onPress={() => { setSelected(null); setSelectedFile(null); evidence.reset(); }} /> : null}</FullScreenFormDrawer>;
}

const styles = StyleSheet.create({
  explainer: { minHeight: 84, padding: 14, flexDirection: "row", alignItems: "center", gap: 11, backgroundColor: nwcColors.surfaceNavyTint }, explainerIcon: { width: 43, height: 43, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.primary }, explainerCopy: { flex: 1, gap: 2 }, explainerTitle: { color: nwcColors.foreground, fontSize: 14, lineHeight: 19, fontFamily: "Poppins_800ExtraBold" }, explainerDetail: { color: nwcColors.muted, fontSize: 11, lineHeight: 16, fontFamily: "Poppins_500Medium" }, files: { gap: 8 }, file: { minHeight: 66, padding: 11, borderRadius: 19, borderWidth: 1, borderColor: "#E2EAEC", backgroundColor: nwcColors.surface, flexDirection: "row", alignItems: "center", gap: 10 }, fileSelected: { borderColor: nwcColors.primary, backgroundColor: nwcColors.surfaceAccent }, fileIcon: { width: 39, height: 39, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.surfaceNavyTint }, fileCopy: { flex: 1, gap: 1 }, fileName: { color: nwcColors.foreground, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_800ExtraBold" }, fileDetail: { color: nwcColors.muted, fontSize: 10, lineHeight: 14, fontFamily: "Poppins_500Medium" }, success: { color: nwcColors.success, fontSize: 11, lineHeight: 16, fontFamily: "Poppins_700Bold", textAlign: "center" }, note: { color: nwcColors.muted, fontSize: 10, lineHeight: 15, fontFamily: "Poppins_500Medium", textAlign: "center" }, error: { color: nwcColors.error, fontSize: 10, lineHeight: 15, fontFamily: "Poppins_600SemiBold", textAlign: "center" },
});
