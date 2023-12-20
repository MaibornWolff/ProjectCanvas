import { Issue } from "../../../../types"
import { StatusType } from "../../../../types/status";

export const storyPointsAccumulator = (issues: Issue[], status: StatusType) =>
  issues.reduce(
    (accumulator, currentValue) => accumulator + (currentValue.status === status ? currentValue.storyPointsEstimate ?? 0 : 0) ?? 0,
    0,
  )

export const inProgressAccumulator = (issues: Issue[], status: StatusType) =>
  issues.reduce(
    (accumulator, currentValue) => accumulator + (currentValue.status === status ? 1 : 0),
    0,
  )
