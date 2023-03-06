import { Group } from "@mantine/core"
import { Updater } from "use-immer"
import { AddCase } from "../Cards/Add/AddCase"
import { addCaseFn } from "../helpers/updaterFunctions"
import { getRndInteger } from "../helpers/utils"
import { Case, SubActionLevel } from "../Types"
import { CaseColumn } from "./CaseColumn"

export function CaseColumns({
  cases,
  setCases,
  levels,
}: {
  cases: Case[]
  setCases: Updater<Case[]>
  levels: SubActionLevel[]
}) {
  const addCase = addCaseFn(setCases)
  return (
    <Group align="start" noWrap>
      {cases.map((caseColumn) => (
        <CaseColumn
          key={caseColumn.title}
          caseColumn={caseColumn}
          levels={levels}
          setCases={setCases}
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
