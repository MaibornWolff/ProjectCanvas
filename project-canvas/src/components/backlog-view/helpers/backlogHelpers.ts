import { Issue, Sprint } from "project-extender"
import { Dispatch, SetStateAction } from "react"

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
  currentSearch: string,
  issuesWrappers: Map<
    string,
    {
      issues: Issue[]
      sprint?: Sprint | undefined
    }
  >,
  searchedissueWrapper: Map<
    string,
    {
      issues: Issue[]
      sprint?: Sprint | undefined
    }
  >,
  setSearchedissueWrapper: Dispatch<
    SetStateAction<
      Map<
        string,
        {
          issues: Issue[]
          sprint?: Sprint | undefined
        }
      >
    >
  >
) => {
  searchedissueWrapper.forEach((issueWrapper, issueWrapperKey) => {
    const newIssueWrapper: {
      issues: Issue[]
      sprint?: Sprint | undefined
    } = { issues: [], sprint: issueWrapper.sprint }
    newIssueWrapper.sprint = issueWrapper.sprint
    newIssueWrapper.issues = issuesWrappers
      .get(issueWrapperKey)!
      .issues.filter(
        (issue: Issue) =>
          issue.summary.toLowerCase().includes(currentSearch.toLowerCase()) ||
          issue.epic?.toLowerCase().includes(currentSearch.toLowerCase()) ||
          issue.assignee?.displayName
            ?.toLowerCase()
            .includes(currentSearch.toLowerCase()) ||
          issue.issueKey.toLowerCase().includes(currentSearch.toLowerCase()) ||
          issue.creator?.toLowerCase().includes(currentSearch.toLowerCase()) ||
          issue.labels?.some((label: string) =>
            label.toLowerCase().includes(currentSearch.toLowerCase())
          ) ||
          currentSearch === ""
      )
    setSearchedissueWrapper(
      (map) => new Map(map.set(issueWrapperKey, newIssueWrapper))
    )
  })
}
