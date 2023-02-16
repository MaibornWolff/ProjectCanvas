import { Paper, PaperProps, useMantineTheme } from "@mantine/core"
import { Draggable } from "react-beautiful-dnd"

export type ItemType = "action" | "subAction"

export function ItemCard({
  id,
  index,
  children,
  itemType = "subAction",
  ...props
}: {
  id: string
  index: number
  children: string
  itemType?: ItemType
} & PaperProps) {
  const theme = useMantineTheme()
  const lookup = new Map<ItemType, string>([
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
          }}
          radius="md"
          p="md"
          m="0"
          shadow="md"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          {...props}
        >
          {children}
        </Paper>
      )}
    </Draggable>
  )
}
