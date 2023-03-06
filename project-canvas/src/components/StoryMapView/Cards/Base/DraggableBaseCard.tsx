import { PaperProps } from "@mantine/core"
import { ReactElement } from "react"
import { Draggable } from "react-beautiful-dnd"
import { BaseCard } from "./BaseCard"

export function DraggableBaseCard({
  id,
  index,
  children,
  ...props
}: {
  id: string
  index: number
  children: ReactElement
} & PaperProps) {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <BaseCard
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          {...props}
        >
          {children}
        </BaseCard>
      )}
    </Draggable>
  )
}
