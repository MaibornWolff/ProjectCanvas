import { Badge } from "@mantine/core"

export function IssueLabelBadge({ label }: { label: string }) {
  return (
    <Badge
      mr={2}
      variant="light"
      color="yellow"
    >
      {label}
    </Badge>
  )
}
