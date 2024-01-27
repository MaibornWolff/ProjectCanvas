import { Accordion, Group } from "@mantine/core";
import { getFilteredCasesForLevel } from "../helpers/utils";
import { Case, SubActionLevel } from "../Types";
import { CaseSubActionLevel } from "./CaseSubActionLevel";
import { LevelControl } from "./LevelControl";

export function LevelAccordion({
  storyMapId,
  cases,
  levels,
}: {
  storyMapId: string,
  cases: Case[],
  levels: SubActionLevel[],
}) {
  return (
    <Accordion
      chevronPosition="left"
      styles={{ content: { padding: 0 } }}
      defaultValue={levels?.length > 0 ? levels.map((level) => level.id) : []}
      multiple
    >
      {levels?.map((level) => (
        <Accordion.Item key={level.id} value={level.id}>
          <LevelControl level={level} storyMapId={storyMapId} />
          <Accordion.Panel>
            <Group align="start">
              <CaseSubActionLevel
                storyMapId={storyMapId}
                filteredCases={getFilteredCasesForLevel(cases, level)}
                levelId={level.id}
              />
            </Group>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
