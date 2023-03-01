import { PaperProps, useMantineTheme } from "@mantine/core"
import { ReactElement } from "react"
import { Draggable } from "react-beautiful-dnd"
import { BaseCard } from "./BaseCard"

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
        <BaseCard
          sx={{
            backgroundColor:
              itemType === "action" ? theme.colors.primaryGreen[0] : "white",
          }}
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
