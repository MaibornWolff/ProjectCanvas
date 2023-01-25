import { Box } from "@mantine/core"
import { Issue } from "project-extender"
import { IssueCard } from "./IssueCard"
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
        <Box {...provided.droppableProps} ref={provided.innerRef}>
          {col.list.map((issue: Issue, index: number) => (
            <IssueCard
              {...issue}
              key={issue.issueKey}
              index={index}
              columnId={col.id}
            />
          ))}
          {provided.placeholder}
        </Box>
      )}
    </StrictModeDroppable>
  )
}
