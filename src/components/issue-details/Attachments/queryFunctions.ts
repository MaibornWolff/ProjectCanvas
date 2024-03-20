import { Resource, Attachment } from "@canvas/types";
import { getDeleteUrl, getDownloadUrl, getThumbnailUrl, getUploadUrl } from "./helpFunctions";

export const getAttachmentThumbnail = (
  attachmentId: string,
  resource: Resource,
): Promise<Blob> => fetch(getThumbnailUrl(attachmentId, resource), {
  method: "GET",
  headers: {
    Accept: "application/json",
    Authorization: resource.authorization,
  },
}).then((data) => data.blob());

export const deleteAttachment = (
  attachmentId: string,
  resource: Resource,
): Promise<void> => fetch(getDeleteUrl(attachmentId, resource), {
  method: "DELETE",
  headers: {
    Accept: "application/json",
    Authorization: resource.authorization,
  },
}).then(() => {});

export const downloadAttachment = (
  attachmentId: string,
  resource: Resource,
): Promise<Blob> => fetch(getDownloadUrl(attachmentId, resource), {
  method: "GET",
  headers: {
    Accept: "application/json",
    Authorization: resource.authorization,
  },
}).then((data) => data.blob());

export const uploadAttachment = (
  issueIdOrKey: string,
  resource: Resource,
  form: FormData,
): Promise<Attachment> => fetch(getUploadUrl(issueIdOrKey, resource), {
  method: "POST",
  body: form,
  headers: {
    Accept: "application/json",
    Authorization: `${resource.authorization}`,
    "X-Atlassian-Token": "no-check",
  },
}).then((att) => att.json());
