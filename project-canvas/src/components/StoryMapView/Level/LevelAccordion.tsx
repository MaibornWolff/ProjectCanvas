import { Accordion, Group } from "@mantine/core"
import { Updater } from "use-immer"
import { addSubActionFn, updateSubActionFn } from "../helpers/updaterFunctions"
import { getFilteredCasesForLevel } from "../helpers/utils"
import { Case, SubActionLevel } from "../Types"
import { CaseSubActionLevel } from "./CaseSubActionLevel"
import { LevelControl } from "./LevelControl"

export function LevelAccordion({
  cases,
  setCases,
  levels,
  setLevels,
}: {
  cases: Case[]
  setCases: Updater<Case[]>
  levels: SubActionLevel[]
  setLevels: Updater<SubActionLevel[]>
}) {
  const addSubAction = addSubActionFn(setCases)
  const updateSubAction = updateSubActionFn(setCases)
  return (
    <Accordion
      chevronPosition="left"
      styles={{ content: { padding: 0 } }}
      defaultValue={levels.map((level) => level.id)}
      multiple
    >
      {levels.map((level) => (
        <Accordion.Item key={level.id} value={level.id}>
          <LevelControl level={level} setLevels={setLevels} />
          <Accordion.Panel>
            <Group align="start">
              <CaseSubActionLevel
                filteredCases={getFilteredCasesForLevel(cases, level)}
                levelId={level.id}
                addSubAction={addSubAction}
                updateSubAction={updateSubAction}
              />
            </Group>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  )
}
