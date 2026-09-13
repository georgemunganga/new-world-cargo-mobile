import type { UploadedDocument, UploadFile } from "@/lib/domain/upload";
import type { UploadRepository } from "@/lib/repositories/types";

export const mockUploadRepository: UploadRepository = {
  async uploadFile(file: UploadFile): Promise<UploadedDocument> {
    return {
      id: `mock-upload-${Date.now()}`,
      url: file.uri,
      filename: file.name,
      contentType: file.type,
    };
  },
  async uploadProfilePhoto(file: UploadFile): Promise<UploadedDocument> {
    return this.uploadFile(file, "profile-photo");
  },
};
