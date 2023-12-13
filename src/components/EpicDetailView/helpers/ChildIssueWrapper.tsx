import { Center, Stack, Text } from "@mantine/core"
import { Issue } from "types"
import { StrictModeDroppable } from "../../common/StrictModeDroppable"
import { IssueCard } from "../../BacklogView/Issue/IssueCard"

export function ChildIssueWrapper({
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
          <Center {...provided.droppableProps} ref={provided.innerRef}>
            <Text align="center" />
            {/* TODO: {provided.placeholder} has been removed so not to make the text move on hover
                             but react beautiful and doesn't like that, we should find a better solution */}
          </Center>
        )
      }
    </StrictModeDroppable>
  )
}
