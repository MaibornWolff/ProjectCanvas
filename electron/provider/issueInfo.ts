import { IProvider } from "electron/providers/base-provider";
import { getProvider } from "./setup";

export async function getIssueTypesByProject(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["getIssueTypesByProject"]>
) {
  return getProvider().getIssueTypesByProject(...params);
}

export async function getLabels(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["getLabels"]>
) {
  return getProvider().getLabels(...params);
}

export async function getPriorities(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["getPriorities"]>
) {
  return getProvider().getPriorities(...params);
}

export async function getEditableIssueFields(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["getEditableIssueFields"]>
) {
  return getProvider().getEditableIssueFields(...params);
}

export async function getIssueReporter(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["getIssueReporter"]>
) {
  return getProvider().getIssueReporter(...params);
}

export async function getIssueTypesWithFieldsMap(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["getIssueTypesWithFieldsMap"]>
) {
  return getProvider().getIssueTypesWithFieldsMap(...params);
}
