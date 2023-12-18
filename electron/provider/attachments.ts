import {IProvider} from "electron/providers/base-provider"
import {getProvider} from "./setup"

export async function uploadAttachment(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["uploadAttachment"]>
) {
  return getProvider().uploadAttachment(...params)
}

export async function downloadAttachment(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["downloadAttachment"]>
) {
  return getProvider().downloadAttachment(...params)
}

export async function getAttachmentThumbnail(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["getAttachmentThumbnail"]>
) {
  return getProvider().getAttachmentThumbnail(...params)
}

export async function deleteAttachment(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["deleteAttachment"]>
) {
  await getProvider().deleteAttachment(...params)
}
