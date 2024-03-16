import { Badge, Box } from "@mantine/core";
import { getStatusTypeColor } from "@canvas/common/status-color";
import { StatusType } from "@canvas/types";

export function StoryPointsBadge({
  statusType,
  storyPointsEstimate,
}: {
  statusType: StatusType,
  storyPointsEstimate: number,
}) {
  return (
    <Box style={{ lineHeight: 1 }}>
      <Badge
        px="7px"
        color={getStatusTypeColor(statusType)}
        variant="filled"
        size="md"
      >
        {storyPointsEstimate}
      </Badge>
    </Box>
  );
}
