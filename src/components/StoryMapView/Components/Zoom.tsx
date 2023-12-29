import { Affix, Group, ActionIcon, Text } from "@mantine/core"
import { IconMinus, IconPlus } from "@tabler/icons"

export function Zoom({
  setZoomValue,
  zoomValue,
}: {
  zoomValue: number
  setZoomValue: (zoomValue: number) => void
}) {
  return (
    <Affix position={{ bottom: 20, right: 20 }}>
      <Group>
        <ActionIcon
          variant="outline"
          color="dark"
          size="sm"
          onClick={() => setZoomValue(zoomValue - 0.1)}
        >
          <IconMinus />
        </ActionIcon>
        <Text w={36} style={{ align: "center" }}>
          {(zoomValue * 100).toFixed()}%
        </Text>
        <ActionIcon
          variant="outline"
          color="dark"
          size="sm"
          onClick={() => setZoomValue(zoomValue + 0.1)}
        >
          <IconPlus />
        </ActionIcon>
      </Group>
    </Affix>
  )
}
