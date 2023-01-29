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

export const sortSprintsByActive = (
  a: string,
  b: string,
  sprints: Map<string, Sprint>
) => {
  if (
    sprints.get(a)!.state === "active" &&
    sprints.get(b)!.state !== "active"
  ) {
    return -1
  }
  if (
    sprints.get(a)!.state !== "active" &&
    sprints.get(b)!.state === "active"
  ) {
    return 1
  }
  return a.localeCompare(b)
}
