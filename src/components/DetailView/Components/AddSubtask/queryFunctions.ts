import { IssueType } from "types";

export const createSubtask = (
  parentIssueKey: string,
  subtaskSummary: string,
  projectId: string,
  subtaskIssueTypeId: string
): Promise<{ id: string; key: string }> =>
  window.provider.createSubtask(
    parentIssueKey,
    subtaskSummary,
    projectId,
    subtaskIssueTypeId
  );
export const getIssueTypes = (projectIdOrKey: string): Promise<IssueType[]> =>
  window.provider.getIssueTypesByProject(projectIdOrKey);
