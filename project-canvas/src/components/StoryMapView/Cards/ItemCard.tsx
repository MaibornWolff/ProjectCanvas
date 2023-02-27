import { Paper, PaperProps, useMantineTheme } from "@mantine/core"
import { ReactElement } from "react"
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
  children: ReactElement
  itemType?: ItemType
} & PaperProps) {
  const theme = useMantineTheme()

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <Paper
          sx={{
            height: "6.5em",
            aspectRatio: "16/8",
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
        >
          {children}
        </Paper>
      )}
    </Draggable>
  )
}
