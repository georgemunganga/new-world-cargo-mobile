import { apiClient } from "@/lib/api/client";
import type { UploadedDocument, UploadFile } from "@/lib/domain/upload";
import type { UploadRepository } from "@/lib/repositories/types";

export const laravelUploadRepository: UploadRepository = {
  async uploadProfilePhoto(file: UploadFile) {
    const form = new FormData();
    form.append("photo", {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as unknown as Blob);
    const response = await apiClient.post<{ data: UploadedDocument }>("/api/customer/profile/photo", form);
    return response.data;
  },
};
