import { Text, HoverCard, Badge } from "@mantine/core"
import { getStatusTypeColor } from "../../../common/status-color";
import { StatusType } from "../../../../types/status";

export function StoryPointsHoverCard({
  statusType,
  count = 0
 }: {
  statusType: StatusType
  count: number
}) {
  return (
    <HoverCard width="relative" shadow="md" radius="md">
      <HoverCard.Target>
        <Badge
          px="7px"
          color={getStatusTypeColor(statusType)}
          variant="filled"
          size="md"
          sx={{
            marginBottom: "20px",
          }}
        >
          <Text size="xs">{count}</Text>
        </Badge>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Text
          size="sm"
          sx={{
            marginLeft: "-5px",
          }}
        >
          Total story points for <b>{statusType}</b> issues: <b>{count}</b>
        </Text>
      </HoverCard.Dropdown>
    </HoverCard>
  )
}
