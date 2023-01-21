import { Issue } from "project-extender"
import { Item } from "./Item"
import { StrictModeDroppable } from "./StrictModeDroppable"

export function Column({
  col,
}: {
  col: {
    id: string
    list: Issue[]
  }
}) {
  return (
    <StrictModeDroppable droppableId={col.id}>
      {(provided) => (
        <div>
          <h2>{col.id}</h2>
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {col.list.map((issue: Issue, index: number) => (
              <Item
                {...issue}
                key={issue.issueKey}
                index={index}
                columnId={col.id}
              />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </StrictModeDroppable>
  )
}
