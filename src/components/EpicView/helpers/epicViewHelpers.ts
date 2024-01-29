import { Issue } from "../../../../types";

export function filterSearch(query : string, epics : Issue[]) {
  const searchString = query.toLowerCase().trim();
  if (!searchString) return epics;
  return epics.filter((item) => item.summary.toLowerCase().includes(searchString)
    || item.issueKey.toLowerCase().includes(searchString)
    || item.assignee?.displayName?.toLowerCase().includes(searchString)
    || item.creator?.toLowerCase().includes(searchString)
    || item.labels?.map((label) => label.toLowerCase()).filter((label) => label.includes(searchString)).length !== 0
    || (item.status?.toLowerCase().includes(searchString)));
}
