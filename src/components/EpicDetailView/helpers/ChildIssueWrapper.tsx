import { Center, Stack, Text } from "@mantine/core"
import { Issue } from "types"
import { StrictModeDroppable } from "../../common/StrictModeDroppable"
import { ChildIssueCard } from "./ChildIssueCard"

export function ChildIssueWrapper({
  id,
  issues,
}: {
  id: string
  issues: Issue[]
}) {
  return (
    <Stack
      spacing="sm"
    >
      {issues.map((issue: Issue, index) => (
        <ChildIssueCard {...issue} key={issue.issueKey} index={index} />
      ))}
    </Stack>
  )
}
