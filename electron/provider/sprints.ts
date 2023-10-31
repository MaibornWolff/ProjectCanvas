import { IProvider } from "electron/providers/base-provider"
import { getProvider } from "./setup"

export async function createSprint(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["createSprint"]>
) {
  await getProvider().createSprint(...params)
}

export async function getSprints(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["getSprints"]>
) {
  const sprints = await getProvider().getSprints(...params)
  return sprints
}

export async function getAssignableUsersByProject(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["getAssignableUsersByProject"]>
) {
  const users = await getProvider().getAssignableUsersByProject(...params)
  return users
}

export async function getEpicsByProject(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["getEpicsByProject"]>
) {
  const epics = await getProvider().getEpicsByProject(...params)
  return epics
}
