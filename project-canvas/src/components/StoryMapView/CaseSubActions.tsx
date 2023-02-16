import { Group, Stack } from "@mantine/core"
import { StrictModeDroppable } from "../common/StrictModeDroppable"
import { ItemCard } from "./Cards"
import { Action } from "./CaseColumn"

export function CaseSubActions({ actions }: { actions: Action[] }) {
  return (
    <Stack>
      <Group align="start" spacing={0} bg="gray.3">
        {actions.map(({ id, subActions }) => (
          <StrictModeDroppable key={id} droppableId={id}>
            {(provided) => (
              <Stack
                spacing={0}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {subActions.map((subAction, index) => (
                  <ItemCard
                    key={subAction}
                    id={`subAction-${subAction}`}
                    index={index}
                    m="10px"
                  >
                    {subAction}
                  </ItemCard>
                ))}
                {provided.placeholder}
              </Stack>
            )}
          </StrictModeDroppable>
        ))}
      </Group>
    </Stack>
  )
}
