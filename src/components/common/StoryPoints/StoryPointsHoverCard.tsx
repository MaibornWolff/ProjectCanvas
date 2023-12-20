import { Text, HoverCard, Box } from "@mantine/core"
import { StatusType } from "../../../../types/status";
import { StoryPointsBadge } from "./StoryPointsBadge";

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
        <Box sx={{ marginBottom: "20px" }}>
          <StoryPointsBadge statusType={statusType} storyPointsEstimate={count} />
        </Box>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Text
          size="sm"
          sx={{ marginLeft: "-5px" }}
        >
          Total story points for <b>{statusType}</b> issues: <b>{count}</b>
        </Text>
      </HoverCard.Dropdown>
    </HoverCard>
  )
}
