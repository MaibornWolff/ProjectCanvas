import { PaperProps } from "@mantine/core"
import { IconPlus } from "@tabler/icons-react"
import { MouseEventHandler } from "react"
import { Draggable } from "@hello-pangea/dnd"
import { BaseCard } from "../Base/BaseCard"

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
        <BaseCard
          style={{
            background: "transparent",
            border: "2px dashed lightgray",
            color: "gray",
          }}
          shadow={undefined}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          {...props}
          onClick={onClick}
        >
          <IconPlus />
        </BaseCard>
      )}
    </Draggable>
  )
}
