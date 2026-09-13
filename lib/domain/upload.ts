export type UploadFile = {
  uri: string;
  name: string;
  type: string;
  size?: number;
};

export type UploadedDocument = {
  id: string;
  url: string;
  filename: string;
  contentType: string;
};
