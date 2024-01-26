import { Issue } from "../../../../types";

export function filtersearch(query :string, epics : Issue[]) {
  const searchstring = query.toLowerCase().trim();
  return epics.filter((item) => item.summary.toLowerCase().includes(searchstring)
    || searchstring === ""
    || item.issueKey.toLowerCase().includes(searchstring)
    || (item.assignee?.displayName?.toLowerCase().includes(searchstring))
    || (item.creator?.toLowerCase().includes(searchstring))
    || !(item.labels?.map((label) => label.toLowerCase()).filter((label) => label.includes(query)).length === 0)
    || (item.status?.toLowerCase().includes(searchstring)));
}
