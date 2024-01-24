import { Issue, Sprint } from "types";

export const BacklogKey = "Backlog";
export type IssuesState = { issues: Issue[]; sprintId?: number };

export const pluralize = (count: number, noun: string, suffix = "s") =>
  `${count} ${noun}${count !== 1 ? suffix : ""}`;

export const sortSprintsByActive = (sprintA: Sprint, sprintB: Sprint) => {
  if (sprintA.state === "active" && sprintB.state !== "active") {
    return -1;
  }
  if (sprintA.state !== "active" && sprintB.state === "active") {
    return 1;
  }
  return sprintA.name.localeCompare(sprintB.name);
};

export const sortIssuesByRank = (issueA: Issue, issueB: Issue) =>
  issueA.rank.localeCompare(issueB.rank);

export const searchMatchesIssue = (search: string, issue: Issue) =>
  search === "" ||
  issue.summary.toLowerCase().includes(search.toLowerCase()) ||
  issue.epic.summary?.toLowerCase().includes(search.toLowerCase()) ||
  issue.assignee?.displayName?.toLowerCase().includes(search.toLowerCase()) ||
  issue.issueKey.toLowerCase().includes(search.toLowerCase()) ||
  issue.creator?.toLowerCase().includes(search.toLowerCase()) ||
  issue.labels?.some((label: string) =>
    label.toLowerCase().includes(search.toLowerCase())
  );
