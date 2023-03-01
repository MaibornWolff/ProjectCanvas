import { Group } from "@mantine/core"
import { Updater } from "use-immer"
import { AddCase } from "../Cards/Add/AddCase"
import {
  addActionFn,
  addCaseFn,
  deleteCaseFn,
  updateActionFn,
  updateCaseFn,
} from "../helpers/updaterFunctions"
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
  const updateCase = updateCaseFn(setCases)
  const deleteCase = deleteCaseFn(setCases)
  const addAction = addActionFn(setCases)
  const updateAction = updateActionFn(setCases)

  return (
    <Group align="start" noWrap>
      {cases.map((caseColumn) => (
        <CaseColumn
          key={caseColumn.title}
          caseColumn={caseColumn}
          levels={levels}
          updateCase={updateCase}
          deleteCase={deleteCase}
          addAction={addAction}
          updateAction={updateAction}
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
