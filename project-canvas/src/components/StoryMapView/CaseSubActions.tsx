import { Group, Stack } from "@mantine/core"
import { StrictModeDroppable } from "../common/StrictModeDroppable"
import { ItemCard } from "./Cards"
import { AddSubActionCard } from "./Cards/AddSubActionCard"
import { Action, SubAction } from "./CaseColumn"
import { getRndInteger } from "./helpers/utils"

export function CaseSubActions({
  actions,
  addSubAction,
}: {
  actions: Action[]
  addSubAction: (actionId: string, subAction: SubAction) => void
}) {
  return (
    <Stack>
      <Group align="start" spacing={0} bg="gray.3">
        {actions.map(({ id: actionId, subActions }) => (
          <StrictModeDroppable key={actionId} droppableId={actionId}>
            {(provided) => (
              <Stack
                spacing={0}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {subActions.map((subAction, index) => (
                  <ItemCard
                    key={subAction.id}
                    id={`subAction-${subAction.id}`}
                    index={index}
                    m="10px"
                  >
                    {subAction.title}
                  </ItemCard>
                ))}
                <AddSubActionCard
                  id={`subAction-add-${actionId}`}
                  index={100}
                  m="10px"
                  onClick={() =>
                    addSubAction(actionId, {
                      id: `ss-${getRndInteger()}`,
                      title: "New SubAction",
                    })
                  }
                />
                {provided.placeholder}
              </Stack>
            )}
          </StrictModeDroppable>
        ))}
        <StrictModeDroppable key="add" droppableId="add" isDropDisabled>
          {(provided) => (
            <Stack
              w="162px"
              spacing={0}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {provided.placeholder}
            </Stack>
          )}
        </StrictModeDroppable>
      </Group>
    </Stack>
  )
}
