import { Issue } from "../../../../types"

export const storyPointsAccumulator = (issues: Issue[], validStatus: string[]) =>
  issues.reduce(
    (accumulator, currentValue) => accumulator + (validStatus.includes(currentValue.status) ? currentValue.storyPointsEstimate ?? 0 : 0) ?? 0,
    0,
  )

export const issueCountAccumulator = (issues: Issue[], validStatus: string[]) =>
  issues.reduce(
    (accumulator, currentValue) => accumulator + (validStatus.includes(currentValue.status) ? 1 : 0),
    0,
  )
