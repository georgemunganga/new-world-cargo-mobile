import { apiClient } from "@/lib/api/client";
import { mobileEnv } from "@/lib/config/env";
import type { UploadedDocument, UploadFile } from "@/lib/domain/upload";
import type { UploadRepository } from "@/lib/repositories/types";

type UploadIntentResponse = {
  fileId: string;
  uploadUrl: string;
  headers?: Record<string, string>;
  requiresPortalAuth?: boolean;
};

type PortalFileResponse = {
  fileId: string;
  url?: string | null;
  contentType?: string;
  sizeBytes?: number;
};

function absoluteUploadUrl(uploadUrl: string) {
  if (/^https?:\/\//i.test(uploadUrl)) return uploadUrl;
  const base = mobileEnv.apiBaseUrl.replace(/\/$/, "");
  return `${base}${uploadUrl.startsWith("/") ? uploadUrl : `/${uploadUrl}`}`;
}

async function fileBlob(file: UploadFile) {
  const response = await fetch(file.uri);
  return response.blob();
}

export const laravelUploadRepository: UploadRepository = {
  async uploadProfilePhoto(file: UploadFile) {
    const blob = await fileBlob(file);
    const intent = await apiClient.post<{ data: UploadIntentResponse }>("/api/v1/files/upload-intents", {
      fileName: file.name,
      contentType: file.type,
      sizeBytes: file.size ?? blob.size,
      purpose: "profile-photo",
    });
    const upload = await fetch(absoluteUploadUrl(intent.data.uploadUrl), {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
        ...(intent.data.headers ?? {}),
      },
      credentials: intent.data.requiresPortalAuth ? "include" : "same-origin",
      body: blob,
    });
    if (!upload.ok) throw new Error("Profile photo upload failed. Please try again.");

    const completed = await apiClient.post<{ data: PortalFileResponse }>(`/api/v1/files/${encodeURIComponent(intent.data.fileId)}/complete`);
    return {
      id: completed.data.fileId,
      url: completed.data.url ?? "",
      filename: file.name,
      contentType: completed.data.contentType ?? file.type,
    };
  },
};
