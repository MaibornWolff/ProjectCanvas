import { IProvider } from "electron/providers/base-provider";
import { getProvider } from "./setup";

export async function addCommentToIssue(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["addCommentToIssue"]>
) {
  await getProvider().addCommentToIssue(...params);
}

export async function editIssueComment(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["editIssueComment"]>
) {
  await getProvider().editIssueComment(...params);
}

export async function deleteIssueComment(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["deleteIssueComment"]>
) {
  await getProvider().deleteIssueComment(...params);
}

export async function getResource(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["getResource"]>
) {
  return getProvider().getResource(...params);
}
