import { Group, Stack } from "@mantine/core"
import { StrictModeDroppable } from "../common/StrictModeDroppable"
import { AddSubActionCard } from "./Cards/AddSubActionCard"
import { SubActionCard } from "./Cards/SubActionCard"
import { getRndInteger } from "./helpers/utils"
import { Action, SubAction } from "./types"

export function CaseSubActions({
  actions,
  addSubAction,
  editSubAction,
}: {
  actions: Action[]
  addSubAction: (actionId: string, subAction: SubAction) => void
  editSubAction: ({ id, title }: SubAction) => void
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
                  <SubActionCard
                    key={subAction.id}
                    id={subAction.id}
                    index={index}
                    editSubAction={editSubAction}
                  >
                    {subAction.title}
                  </SubActionCard>
                ))}
                <AddSubActionCard
                  id={`subAction-add-${actionId}`}
                  index={subActions.length}
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
