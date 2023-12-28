import { Group } from "@mantine/core"
import { AddCase } from "../Cards/Add/AddCase"
import { CASE_PREFIX, getRndInteger } from "../helpers/utils"
import { useStoryMapStore } from "../StoryMapStore"
import { Case, SubActionLevel } from "../Types"
import { CaseColumn } from "./CaseColumn"

export function CaseColumns({
  storyMapId,
  cases,
  levels,
}: {
  storyMapId: string
  cases: Case[]
  levels: SubActionLevel[]
}) {
  const addCase = useStoryMapStore((state) => state.addCase)
  return (
    <Group align="start" wrap="nowrap">
      {cases.map((caseColumn) => (
        <CaseColumn
          key={caseColumn.title}
          storyMapId={storyMapId}
          caseColumn={caseColumn}
          levels={levels}
        />
      ))}
      <AddCase
        onClick={() =>
          addCase(storyMapId, {
            id: `${CASE_PREFIX}-${getRndInteger()}`,
            title: "New Case",
            actions: [],
          })
        }
      />
    </Group>
  )
}
