import { useState } from "react";
import { customerSafeMessageFor } from "@/lib/api/errors";
import { repositories } from "@/lib/repositories";
import type { UploadFile, UploadedDocument } from "@/lib/domain/upload";

export function useSupportEvidence() {
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [document, setDocument] = useState<UploadedDocument | null>(null);

  const uploadEvidence = async (caseId: string, file: UploadFile) => {
    setStatus("uploading");
    setErrorMessage("");
    try {
      const uploaded = await repositories.uploads.uploadFile(file, "support-attachment");
      await repositories.support.attachEvidence(caseId, uploaded.id);
      setDocument(uploaded);
      setStatus("success");
      return uploaded;
    } catch (error) {
      setErrorMessage(customerSafeMessageFor(error));
      setStatus("error");
      return null;
    }
  };

  const reset = () => {
    setStatus("idle");
    setErrorMessage("");
    setDocument(null);
  };

  return { status, errorMessage, document, uploadEvidence, reset };
}
