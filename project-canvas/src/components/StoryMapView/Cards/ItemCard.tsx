import { Paper, useMantineTheme } from "@mantine/core"
import { Draggable } from "react-beautiful-dnd"

export type ItemType = "title" | "action" | "subAction"

export function ItemCard({
  id,
  index,
  children,
  itemType = "subAction",
}: {
  id: string
  index: number
  children: string
  itemType?: ItemType
}) {
  const theme = useMantineTheme()
  const lookup = new Map<ItemType, string>([
    ["title", theme.colors.primaryBlue[0]],
    ["action", theme.colors.primaryGreen[0]],
    ["subAction", "white"],
  ])
  const color = lookup.get(itemType)
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <Paper
          sx={{
            height: "5em",
            aspectRatio: "16/9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: color,
            width: itemType === "title" ? "100%" : "",
          }}
          radius="md"
          p="md"
          shadow="md"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {children}
        </Paper>
      )}
    </Draggable>
  )
}
