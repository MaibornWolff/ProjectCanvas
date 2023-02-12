import { Paper } from "@mantine/core"
import { Draggable } from "react-beautiful-dnd"

export function BaseCard({
  id,
  index,
  children,
}: {
  id: string
  index: number
  children: string
}) {
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
