import { Resource } from "types"

export function getThumbnailUrl(
  attachmentId: string,
  resource: Resource
): string {
  return `${resource.baseUrl}/attachment/thumbnail/${attachmentId}`
}

export const getDownloadUrl = (
  attachmentId: string,
  resource: Resource
): string => `${resource.baseUrl}/attachment/content/${attachmentId}`

export const getDeleteUrl = (
  attachmentId: string,
  resource: Resource
): string => `${resource.baseUrl}/attachment/${attachmentId}`

export const getUploadUrl = (
  issueIdOrKey: string,
  resource: Resource
): string => `${resource.baseUrl}/issue/${issueIdOrKey}/attachments`
