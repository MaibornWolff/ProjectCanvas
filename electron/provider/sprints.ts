import { IProvider } from "electron/providers/base-provider";
import { getProvider } from "./setup";

export async function createSprint(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["createSprint"]>
) {
  await getProvider().createSprint(...params);
}

export async function getSprints(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["getSprints"]>
) {
  return getProvider().getSprints(...params);
}

export async function getAssignableUsersByProject(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["getAssignableUsersByProject"]>
) {
  return getProvider().getAssignableUsersByProject(...params);
}

export async function getEpicsByProject(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["getEpicsByProject"]>
) {
  return getProvider().getEpicsByProject(...params);
}
