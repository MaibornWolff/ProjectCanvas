import { Issue } from "../../../../types";

export function filterSearch(query : string, epics : Issue[]) {
  const search = query.toLowerCase().trim();
  if (!search) return epics;
  return epics.filter((item) => item.summary.toLowerCase().includes(search)
    || item.issueKey.toLowerCase().includes(search)
    || item.assignee?.displayName?.toLowerCase().includes(search)
    || item.creator?.toLowerCase().includes(search)
    || item.labels?.some((label: string) => label.toLowerCase().includes(search.toLowerCase()))
    || (item.status?.toLowerCase().includes(search)));
}
