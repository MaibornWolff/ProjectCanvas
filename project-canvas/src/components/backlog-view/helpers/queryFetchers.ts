/* eslint-disable no-console */
import { Issue, Sprint, Resource } from "project-extender"

export const getSprints = (boardId: number): Promise<Sprint[]> =>
  fetch(`${import.meta.env.VITE_EXTENDER}/sprintsByBoardId?boardId=${boardId}`)
    .then((sprints) => sprints.json())
    .catch((err) => err)

export const getIssuesBySprint = (
  sprintId: number | undefined
): Promise<Issue[]> =>
  fetch(`${import.meta.env.VITE_EXTENDER}/issuesBySprint?sprint=${sprintId}`)
    .then((issues) => issues.json())
    .catch((err) => err)

export const getBacklogIssues = (
  projectKey: string | undefined,
  boardId: number
): Promise<Issue[]> =>
  fetch(
    `${
      import.meta.env.VITE_EXTENDER
    }/backlogIssuesByProjectAndBoard?project=${projectKey}&boardId=${boardId}`
  )
    .then((issues) => issues.json())
    .catch((err) => err)

// TODO: Status code handling
export const getAttachmentThumbnail = (id: string): Promise<string> =>
  fetch(`${import.meta.env.VITE_EXTENDER}/attachmentThumbnail?id=${id}`)
    .then(async (res) => res.json())
    .then((t: Resource) =>
      fetch(t.url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: t.authorization,
        },
      })
        .then((data) => data.blob())
        .then((b) => URL.createObjectURL(b))
        .catch((err) => err)
    )
    .catch((err) => err)

export const deleteAttachment = (attachmentId: string): Promise<void> =>
  fetch(
    `${import.meta.env.VITE_EXTENDER}/deleteAttachment?id=${attachmentId}`
  ).catch((err) => err)

// TODO: Status code handling
export const downloadAttachment = (id: string): Promise<string> =>
  fetch(`${import.meta.env.VITE_EXTENDER}/downloadAttachment?id=${id}`)
    .then(async (res) => res.json())
    .then((t: Resource) =>
      fetch(t.url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: t.authorization,
        },
      })
        .then((data) => data.blob())
        .then((b) => URL.createObjectURL(b))
        .catch((err) => err)
    )
    .catch((err) => err)
