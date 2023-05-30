import { IProvider } from "electron/providers/base-provider"
import { getProvider } from "./setup"

export async function editIssue(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["editIssue"]>
) {
  await getProvider().editIssue(...params)
}

export async function createIssue(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["createIssue"]>
) {
  const issueId = await getProvider().createIssue(...params)
  return issueId
}

export async function getIssuesByProject(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["getIssuesByProject"]>
) {
  const issues = await getProvider().getIssuesByProject(...params)
  return issues
}

export async function getIssuesBySprint(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["getIssuesBySprint"]>
) {
  const issues = await getProvider().getIssuesBySprint(...params)
  return issues
}

export async function getBacklogIssuesByProjectAndBoard(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["getBacklogIssuesByProjectAndBoard"]>
) {
  const issues = await getProvider().getBacklogIssuesByProjectAndBoard(
    ...params
  )
  return issues
}

export async function deleteIssue(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["deleteIssue"]>
) {
  await getProvider().deleteIssue(...params)
}

export async function moveIssueToSprintAndRank(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["moveIssueToSprintAndRank"]>
) {
  await getProvider().moveIssueToSprintAndRank(...params)
}

export async function moveIssueToBacklog(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["moveIssueToBacklog"]>
) {
  await getProvider().moveIssueToBacklog(...params)
}

export async function rankIssueInBacklog(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["rankIssueInBacklog"]>
) {
  await getProvider().rankIssueInBacklog(...params)
}
