import { Issue, Sprint } from "project-extender"

export const storyPointsAccumulator = (issues: Issue[], status: string) =>
  issues.reduce((accumulator, currentValue) => {
    if (currentValue.storyPointsEstimate && currentValue.status === status) {
      return accumulator + currentValue.storyPointsEstimate
    }
    return accumulator
  }, 0)

export const pluralize = (count: number, noun: string, suffix = "s") =>
  `${count} ${noun}${count !== 1 ? suffix : ""}`

export const sortSprintsByActive = (sprintA: Sprint, sprintB: Sprint) => {
  if (sprintA.state === "active" && sprintB.state !== "active") {
    return -1
  }
  if (sprintA.state !== "active" && sprintB.state === "active") {
    return 1
  }
  return sprintA.name.localeCompare(sprintB.name)
}

export const sortIssuesByRank = (issueA: Issue, issueB: Issue) =>
  issueA.rank.localeCompare(issueB.rank)

export const searchIssuesFilter = (
  issueWrapper: {
    issues: Issue[]
    sprint?: Sprint | undefined
  },
  currentSearch: string,
  issuesWrappers: Map<
    string,
    {
      issues: Issue[]
      sprint?: Sprint | undefined
    }
  >
) => {
  const newIssueWrapper: {
    issues: Issue[]
    sprint?: Sprint | undefined
  } = { issues: [], sprint: issueWrapper.sprint }
  newIssueWrapper.sprint = issueWrapper.sprint
  const newIssueWrapperKey =
    newIssueWrapper.sprint !== undefined
      ? newIssueWrapper.sprint.name
      : "Backlog"

  newIssueWrapper.issues = issuesWrappers
    .get(newIssueWrapperKey)!
    .issues.filter(
      (issue: Issue) =>
        issue.summary.includes(currentSearch) || currentSearch === ""
    )
  return { newIssueWrapperKey, newIssueWrapper }
}
