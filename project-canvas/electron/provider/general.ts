import { IProvider } from "../providers/base-provider/BaseProvider"
import { getProvider } from "./setup"

export async function getProjects() {
  const projects = await getProvider().getProjects()
  return projects
}

export async function getCurrentUser() {
  const currentUser = await getProvider().getCurrentUser()
  return currentUser
}

export async function getBoardIds(
  _: Electron.IpcMainInvokeEvent,
  params: Parameters<IProvider["getBoardIds"]>
) {
  await getProvider().getBoardIds(...params)
}

export async function setTransition(
  _: Electron.IpcMainInvokeEvent,
  params: Parameters<IProvider["setTransition"]>
) {
  await getProvider().setTransition(...params)
}

export async function createSubtask(
  _: Electron.IpcMainInvokeEvent,
  params: Parameters<IProvider["createSubtask"]>
) {
  await getProvider().createSubtask(...params)
}
