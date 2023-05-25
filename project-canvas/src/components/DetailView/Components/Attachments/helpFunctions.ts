import { Resource } from "types"

export function getThumbnailUrl(
  attachemntId: string,
  resource: Resource
): string {
  return `${resource.baseUrl}/attachment/thumbnail/${attachemntId}`
}

export const getDownloadUrl = (
  attachemntId: string,
  resource: Resource
): string => `${resource.baseUrl}/attachment/content/${attachemntId}`

export const getDeleteUrl = (
  attachemntId: string,
  resource: Resource
): string => `${resource.baseUrl}/attachment/${attachemntId}`

export const getUploadUrl = (
  issueIdOrKey: string,
  resource: Resource
): string => `${resource.baseUrl}/issue/${issueIdOrKey}/attachments`
