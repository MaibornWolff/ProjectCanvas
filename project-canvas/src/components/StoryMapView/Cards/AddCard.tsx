import { Paper, PaperProps } from "@mantine/core"
import { IconPlus } from "@tabler/icons"
import { MouseEventHandler } from "react"
import { Draggable } from "react-beautiful-dnd"

export function AddCard({
  id,
  index,
  onClick,
  ...props
}: {
  id: string
  index: number
  onClick: MouseEventHandler<HTMLDivElement>
} & PaperProps) {
  return (
    <Draggable draggableId={id} index={index} isDragDisabled>
      {(provided) => (
        <Paper
          sx={{
            height: "5em",
            aspectRatio: "16/9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "2px dashed lightgray",
            color: "gray",
            cursor: "pointer",
          }}
          radius="sm"
          m="sm"
          p="md"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          {...props}
          onClick={onClick}
        >
          <IconPlus />
        </Paper>
      )}
    </Draggable>
  )
}
