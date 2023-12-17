import { Issue } from "../../../../types"

export const storyPointsAccumulator = (issues: Issue[], status: string) =>
  issues.reduce((accumulator, currentValue) => {
    if (currentValue.storyPointsEstimate && currentValue.status === status) {
      return accumulator + currentValue.storyPointsEstimate
    }
    return accumulator
  }, 0)

export const inProgressAccumulator = (issues: Issue[], status: string) =>
  issues.reduce((accumulator, currentValue) => {
    if (currentValue.status === status) {
      return accumulator + 1
    }
    return accumulator
  }, 0)
