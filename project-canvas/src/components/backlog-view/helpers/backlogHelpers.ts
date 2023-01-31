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
