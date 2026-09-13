import { useState } from "react";
import { customerSafeMessageFor } from "@/lib/api/errors";
import type { UploadedDocument, UploadFile } from "@/lib/domain/upload";
import { repositories } from "@/lib/repositories";

export function useProfilePhoto() {
  const [document, setDocument] = useState<UploadedDocument | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const upload = async (file: UploadFile) => {
    setStatus("uploading");
    setErrorMessage("");
    try {
      const uploaded = await repositories.uploads.uploadProfilePhoto(file);
      setDocument(uploaded);
      setStatus("success");
      await repositories.customer.updateProfile({ avatarUrl: uploaded.id });
      return uploaded;
    } catch (error) {
      setErrorMessage(customerSafeMessageFor(error));
      setStatus("error");
      return null;
    }
  };

  const clear = async () => {
    setDocument(null);
    await repositories.customer.updateProfile({ avatarUrl: undefined });
  };

  return { document, status, errorMessage, upload, clear };
}
