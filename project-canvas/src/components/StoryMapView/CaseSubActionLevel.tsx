import { Group, Stack } from "@mantine/core"
import { StrictModeDroppable } from "../common/StrictModeDroppable"
import { SubActionGroup } from "./SubActionGroup"
import { Case, SubAction } from "./types"

export function CaseSubActionLevel({
  filteredCases,
  levelId,
  addSubAction,
  editSubAction,
}: {
  filteredCases: Case[]
  levelId: string
  addSubAction: (actionId: string, subAction: SubAction) => void
  editSubAction: ({ id, title }: SubAction) => void
}) {
  return (
    <Group align="start">
      {filteredCases.map((caseColumn) => (
        <Group align="start" key={`${caseColumn.id}-${levelId}`} spacing={0}>
          {caseColumn.actions
            .map((_action) => _action.subActionGroups)
            .flat()
            .map(({ id: subActionGroupId, subActions }) => (
              <SubActionGroup
                subActionGroupId={subActionGroupId}
                subActions={subActions}
                addSubAction={addSubAction}
                editSubAction={editSubAction}
              />
            ))}

          <StrictModeDroppable key="add" droppableId="add" isDropDisabled>
            {(provided) => (
              <Stack
                w="162px"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {provided.placeholder}
              </Stack>
            )}
          </StrictModeDroppable>
        </Group>
      ))}
    </Group>
  )
}
