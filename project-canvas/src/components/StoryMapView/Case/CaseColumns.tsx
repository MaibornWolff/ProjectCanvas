import { Group } from "@mantine/core"
import { AddCase } from "../Cards/Add/AddCase"
import { getRndInteger } from "../helpers/utils"
import { useStoryMapStore } from "../StoryMapStore"
import { Case, SubActionLevel } from "../Types"
import { CaseColumn } from "./CaseColumn"

export function CaseColumns({
  cases,
  levels,
}: {
  cases: Case[]
  levels: SubActionLevel[]
}) {
  const addCase = useStoryMapStore((state) => state.addCase)
  return (
    <Group align="start" noWrap>
      {cases.map((caseColumn) => (
        <CaseColumn
          key={caseColumn.title}
          caseColumn={caseColumn}
          levels={levels}
        />
      ))}
      <AddCase
        onClick={() =>
          addCase({
            id: `a-${getRndInteger()}`,
            title: "New Case",
            actions: [],
          })
        }
      />
    </Group>
  )
}
