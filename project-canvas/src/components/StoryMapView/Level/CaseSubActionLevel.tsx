import { Group } from "@mantine/core"
import { BaseCard } from "../Cards/BaseCard"
import { SubActionGroup } from "../Case/SubActionGroup"
import { Case, SubAction } from "../Types"

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
          <BaseCard
            sx={{ cursor: "default", background: "transparent" }}
            shadow={undefined}
          />
        </Group>
      ))}
    </Group>
  )
}
