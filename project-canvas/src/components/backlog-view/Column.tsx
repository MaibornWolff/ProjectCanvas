import { Box, Stack, Text } from "@mantine/core"
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
      {(provided) =>
        col.list.length !== 0 ? (
          <Stack
            {...provided.droppableProps}
            ref={provided.innerRef}
            spacing="sm"
          >
            {col.list.map((issue: Issue, index: number) => (
              <IssueCard
                {...issue}
                key={issue.issueKey}
                index={index}
                columnId={col.id}
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
            {" "}
            <Text align="center">Drop Here</Text>
            {provided.placeholder}
          </Box>
        )
      }
    </StrictModeDroppable>
  )
}
