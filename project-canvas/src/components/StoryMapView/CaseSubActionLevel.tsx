import { Group, Stack } from "@mantine/core"
import { StrictModeDroppable } from "../common/StrictModeDroppable"
import { SubActionGroup } from "./SubActionGroup"
import { Case, SubAction } from "./types"

export function CaseSubActionLevel({
  filteredCases,
  levelId,
  addSubAction,
  updateSubAction,
}: {
  filteredCases: Case[]
  levelId: string
  addSubAction: (actionId: string, subAction: SubAction) => void
  updateSubAction: ({ id, title }: SubAction) => void
}) {
  return (
    <Group align="start" noWrap>
      {filteredCases.map((caseColumn) => (
        <Group
          key={`${caseColumn.id}-${levelId}`}
          align="start"
          noWrap
          spacing={0}
        >
          {caseColumn.actions
            .map((_action) => _action.subActionGroups)
            .flat()
            .map(({ id: subActionGroupId, subActions }) => (
              <SubActionGroup
                key={subActionGroupId}
                subActionGroupId={subActionGroupId}
                subActions={subActions}
                addSubAction={addSubAction}
                updateSubAction={updateSubAction}
              />
            ))}

          <StrictModeDroppable key="add" droppableId="add" isDropDisabled>
            {(provided) => (
              <Stack
                sx={{ height: "6.5em", aspectRatio: "16/8" }}
                m="sm"
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
