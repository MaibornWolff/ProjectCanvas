import { Group } from "@mantine/core"
import { Updater } from "use-immer"
import { BaseCard } from "../Cards/Base/BaseCard"
import { SubActionGroup } from "../Case/SubActionGroup"
import { Case } from "../Types"

export function CaseSubActionLevel({
  filteredCases,
  levelId,
  setCases,
}: {
  filteredCases: Case[]
  levelId: string
  setCases: Updater<Case[]>
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
                setCases={setCases}
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
