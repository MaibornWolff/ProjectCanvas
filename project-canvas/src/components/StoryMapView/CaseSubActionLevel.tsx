import { Group, Stack } from "@mantine/core"
import { StrictModeDroppable } from "../common/StrictModeDroppable"
import { AddSubActionCard } from "./Cards/AddSubActionCard"
import { SubActionCard } from "./Cards/SubActionCard"
import { getRndInteger } from "./helpers/utils"
import { SubAction, SubActionGroup } from "./types"

export function CaseSubActionLevel({
  subActionGroups,
  addSubAction,
  editSubAction,
}: {
  subActionGroups: SubActionGroup[]
  addSubAction: (actionId: string, subAction: SubAction) => void
  editSubAction: ({ id, title }: SubAction) => void
}) {
  return (
    <Stack>
      <Group align="start" spacing={0} bg="gray.3">
        {subActionGroups.map(({ id: subActionGroupId, subActions }) => (
          <StrictModeDroppable
            key={subActionGroupId}
            droppableId={subActionGroupId}
          >
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
                  id={`subAction-add-${subActionGroupId}`}
                  index={subActions.length}
                  onClick={() =>
                    addSubAction(subActionGroupId, {
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
