import { Group, Paper, Stack } from "@mantine/core"
import { StrictModeDroppable } from "../common/StrictModeDroppable"
import { ItemCard } from "./Cards"

export interface Action {
  id: string
  action: string
  subActions: string[]
}
export interface Case {
  id: string
  title: string
  actions: Action[]
}

export function CaseColumn({ id, title, actions }: Case) {
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

      <StrictModeDroppable droppableId={id} direction="horizontal">
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
