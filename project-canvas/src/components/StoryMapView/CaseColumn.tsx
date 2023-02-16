import { Group, Paper, Stack } from "@mantine/core"
import { StrictModeDroppable } from "../common/StrictModeDroppable"
import { ItemCard } from "./Cards"

export interface Action {
  id: string
  action: string
  subActions: { id: string; items: string[] }
}
export interface Case {
  title: string
  actions: Action[]
}

export function CaseColumn({
  title,
  actions,
}: {
  title: string
  actions: {
    id: string
    action: string
    subActions: { id: string; items: string[] }
  }[]
}) {
  return (
    <Stack>
      <Paper
        sx={(theme) => ({
          height: "5em",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.primaryBlue[0],
          width: "100%",
        })}
        radius="md"
        p="md"
        shadow="md"
      >
        {title}
      </Paper>

      <StrictModeDroppable droppableId={title} direction="horizontal">
        {(provided) => (
          <Group
            bg="gray.2"
            spacing={0}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {actions.map(({ action }, index) => (
              <ItemCard
                key={action}
                id={`action-${action}`}
                index={index}
                itemType="action"
                m="10px"
              >
                {action}
              </ItemCard>
            ))}
            {provided.placeholder}
          </Group>
        )}
      </StrictModeDroppable>
    </Stack>
  )
}
