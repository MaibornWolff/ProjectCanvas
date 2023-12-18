import { Resource, Attachment } from "types"

export const getResource = (): Promise<Resource> =>
  window.provider.getResource()

export const getAttachmentThumbnail = (attachmentId: string): Promise<Blob> =>
  window.provider.getAttachmentThumbnail(attachmentId)

export const deleteAttachment = (attachmentId: string): Promise<void> =>
  window.provider.deleteAttachment(attachmentId)

export const downloadAttachment = (attachmentId: string): Promise<Blob> =>
  window.provider.downloadAttachment(attachmentId)

export const uploadAttachment = (
  issueIdOrKey: string,
  form: FormData
): Promise<Attachment> =>
  window.provider.uploadAttachment(issueIdOrKey, form)
