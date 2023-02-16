import { Group, Stack } from "@mantine/core"
import { StrictModeDroppable } from "../common/StrictModeDroppable"
import { ItemCard } from "./Cards"

export function CaseSubActions({
  actions,
}: {
  actions: {
    id: string
    action: string
    subActions: { id: string; items: string[] }
  }[]
}) {
  return (
    <Stack>
      <Group align="start" spacing={0} bg="gray.3">
        {actions.map(({ subActions }) => (
          <StrictModeDroppable key={subActions.id} droppableId={subActions.id}>
            {(provided) => (
              <Stack
                spacing={0}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {subActions.items.map((subActionItem, index) => (
                  <ItemCard
                    key={subActionItem}
                    id={`subAction-${subActionItem}`}
                    index={index}
                    m="10px"
                  >
                    {subActionItem}
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
