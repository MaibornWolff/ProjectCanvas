import { IProvider } from "electron/providers/base-provider";
import { getProvider } from "./setup";

export async function getIssueTypesByProject(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["getIssueTypesByProject"]>
) {
  const issueTypes = await getProvider().getIssueTypesByProject(...params);
  return issueTypes;
}

export async function getLabels(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["getLabels"]>
) {
  const labels = await getProvider().getLabels(...params);
  return labels;
}

export async function getPriorities(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["getPriorities"]>
) {
  const priorities = await getProvider().getPriorities(...params);
  return priorities;
}

export async function getEditableIssueFields(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["getEditableIssueFields"]>
) {
  const issueFileds = await getProvider().getEditableIssueFields(...params);
  return issueFileds;
}

export async function getIssueReporter(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["getIssueReporter"]>
) {
  const issueReporter = await getProvider().getIssueReporter(...params);
  return issueReporter;
}

export async function getIssueTypesWithFieldsMap(
  _: Electron.IpcMainInvokeEvent,
  ...params: Parameters<IProvider["getIssueTypesWithFieldsMap"]>
) {
  const issuesTypesWithFiledsMap =
    await getProvider().getIssueTypesWithFieldsMap(...params);
  return issuesTypesWithFiledsMap;
}
