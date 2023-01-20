import { List } from "@mantine/core"
import { StrictModeDroppable } from "./StrictModeDroppable"
import { Item, Pbi } from "./Item"

interface ColumnProps {
  col: {
    id: string
    list: Pbi[]
  }
}

export function Column({ col }: ColumnProps) {
  return (
    <StrictModeDroppable droppableId={col.id}>
      {(provided) => (
        <div>
          <h2>{col.id}</h2>
          <List {...provided.droppableProps} ref={provided.innerRef}>
            {col.list.map((pbi: Pbi, index: number) => (
              <Item {...pbi} index={index} columnId={col.id} />
            ))}
            {provided.placeholder}
          </List>
        </div>
      )}
    </StrictModeDroppable>
  )
}
