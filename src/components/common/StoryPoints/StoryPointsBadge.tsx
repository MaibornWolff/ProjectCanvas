import { Badge } from "@mantine/core"
import { getStatusTypeColor } from "../../../common/status-color";
import { StatusType } from "../../../../types/status";

export function StoryPointsBadge({
  statusType,
  storyPointsEstimate
 }: {
  statusType: StatusType
  storyPointsEstimate: number
}) {
  return (
    <Badge
      px="7px"
      color={getStatusTypeColor(statusType)}
      variant="filled"
      size="md"
    >
      {storyPointsEstimate}
    </Badge>
  )
}
