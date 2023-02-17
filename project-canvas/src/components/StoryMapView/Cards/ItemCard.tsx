import { Paper, PaperProps, useMantineTheme } from "@mantine/core"
import { Draggable } from "react-beautiful-dnd"

export type ItemType = "action" | "subAction"

export function ItemCard({
  id,
  index,
  children,
  editItem,
  itemType = "subAction",
  ...props
}: {
  id: string
  index: number
  children: string
  editItem: () => void
  itemType?: ItemType
} & PaperProps) {
  const theme = useMantineTheme()

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
            backgroundColor:
              itemType === "action" ? theme.colors.primaryGreen[0] : "white",
          }}
          radius="sm"
          p="md"
          m="sm"
          shadow="sm"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          {...props}
          onClick={editItem}
        >
          {children}
        </Paper>
      )}
    </Draggable>
  )
}
