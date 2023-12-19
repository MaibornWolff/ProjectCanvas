import {Text, HoverCard, Badge} from "@mantine/core"
import {MantineColor} from "@mantine/styles";

export function StoryPointsHoverCard({
  statusType,
  color,
  count = 0
 }: {
  statusType: string
  color: MantineColor,
  count: number
}) {
  return (
    <HoverCard width="relative" shadow="md" radius="md">
      <HoverCard.Target>
        <Badge
          px="7px"
          color={color}
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
