import { Stack } from "@mantine/core"
import { Issue } from "../../../../../types"
import { ChildIssueCard } from "./ChildIssueCard"

export function ChildIssueWrapper({ issues }: { issues: Issue[] }) {
  return (
    <Stack spacing="sm">
      {issues.map((issue: Issue, index) => (
        <ChildIssueCard {...issue} key={issue.issueKey} index={index} />
      ))}
    </Stack>
  )
}