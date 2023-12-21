import { Badge } from "@mantine/core"

export function IssueLabelBadge({ issueKey, label }: { issueKey: string, label: string }) {
  return (
    <Badge
      mr={2}
      key={`${issueKey}-${label}`}
      variant="light"
      color="yellow"
    >
      {label}
    </Badge>
  )
}
