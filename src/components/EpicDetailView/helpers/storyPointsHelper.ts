import { Issue } from "../../../../types"

export const storyPointsAccumulator = (issues: Issue[], status: string) =>
  issues.reduce(
    (accumulator, currentValue) => accumulator + (currentValue.status === status ? currentValue.storyPointsEstimate ?? 0 : 0) ?? 0,
    0,
  )

export const inProgressAccumulator = (issues: Issue[], status: string) =>
  issues.reduce(
    (accumulator, currentValue) => accumulator + (currentValue.status === status ? 1 : 0),
    0,
  )
