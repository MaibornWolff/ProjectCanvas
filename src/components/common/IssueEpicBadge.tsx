import { Badge } from "@mantine/core"

export function IssueEpicBadge({
  issueKey,
  epic,
}: {
  issueKey: string
  epic: { summary?: string }
}) {
  return (
    <Badge mr={5} key={`${issueKey}-epic`} variant="light" color="violet">
      {epic.summary}
    </Badge>
  )
}
