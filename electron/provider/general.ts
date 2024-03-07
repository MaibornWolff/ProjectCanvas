import { IProvider } from "../providers/base-provider/BaseProvider";
import { getProvider } from "./setup";

export async function getProjects() {
  return getProvider().getProjects();
}

export async function getCurrentUser() {
  return getProvider().getCurrentUser();
}

export async function getBoardIds(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["getBoardIds"]>
) {
  return getProvider().getBoardIds(...params);
}

export async function setTransition(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["setTransition"]>
) {
  await getProvider().setTransition(...params);
}

export async function createSubtask(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["createSubtask"]>
) {
  return getProvider().createSubtask(...params);
}
