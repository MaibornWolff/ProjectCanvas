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
              <IssueCard {...issue} key={issue.issueKey} index={index} />
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
            <Text align="center">Drop Here</Text>
            {/* TODO: {provided.placeholder} has been removed so not to make the text move on hover
            but react beautiful dnd doesn't like that, we should find a better solution */}
          </Center>
        )
      }
    </StrictModeDroppable>
  )
}
