import { Center, Stack, Text } from "@mantine/core"
import { Issue } from "project-extender"
import { StrictModeDroppable } from "../../common/StrictModeDroppable"
import { IssueCard } from "../Issue/IssueCard"

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
          <Center
            sx={(theme) => ({
              borderStyle: "dotted",
              borderColor: "lightgray",
              height: "6em",
              borderRadius: theme.radius.md,
            })}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <Text align="center" sx={{ zIndex: 0 }}>
              Drop Here
            </Text>
          </Center>
        )
      }
    </StrictModeDroppable>
  )
}