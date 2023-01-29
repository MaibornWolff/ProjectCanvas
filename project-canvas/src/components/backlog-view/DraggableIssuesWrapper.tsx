import { Box, Stack, Text } from "@mantine/core"
import { Issue } from "project-extender"
import { IssueCard } from "./IssueCard"
import { StrictModeDroppable } from "./StrictModeDroppable"

export function DraggableIssuesWrapper({
  id,
  issues,
}: {
  id: string
  issues: Issue[]
}) {
  return (
    <StrictModeDroppable droppableId={id}>
      {(provided) =>
        issues.length !== 0 ? (
          <Stack
            {...provided.droppableProps}
            ref={provided.innerRef}
            spacing="sm"
          >
            {issues.map((issue: Issue, index) => (
              <IssueCard
                {...issue}
                key={issue.issueKey}
                index={index}
                columnId={id}
              />
            ))}
            {provided.placeholder}
          </Stack>
        ) : (
          <Box
            sx={{ borderStyle: "dotted" }}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <Text align="center">Drop Here</Text>
            {provided.placeholder}
          </Box>
        )
      }
    </StrictModeDroppable>
  )
}
