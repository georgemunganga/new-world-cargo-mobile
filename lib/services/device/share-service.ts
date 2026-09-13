export type ShareDocumentInput = {
  title: string;
  filename: string;
  text: string;
  url?: string;
};

export const shareService = {
  async shareDocument(input: ShareDocumentInput) {
    if (typeof navigator !== "undefined" && "share" in navigator && input.url) {
      await navigator.share({ title: input.title, text: input.text, url: input.url });
      return { shared: true };
    }
    return { shared: false };
  },
};
