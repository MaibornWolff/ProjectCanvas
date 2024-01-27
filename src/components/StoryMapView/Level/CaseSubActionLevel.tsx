import { Group } from "@mantine/core";
import { BaseCard } from "../Cards/Base/BaseCard";
import { SubActionGroup } from "./SubActionGroup";
import { Case } from "../Types";

export function CaseSubActionLevel({
  storyMapId,
  filteredCases,
  levelId,
}: {
  storyMapId: string,
  filteredCases: Case[],
  levelId: string,
}) {
  return (
    <Group align="start" wrap="nowrap">
      {filteredCases.map((caseColumn) => (
        <Group
          key={`${caseColumn.id}-${levelId}`}
          align="start"
          wrap="nowrap"
          gap={0}
        >
          {caseColumn.actions
            .map((_action) => _action.subActionGroups)
            .flat()
            .map(({ id: subActionGroupId, subActions }) => (
              <SubActionGroup
                key={subActionGroupId}
                storyMapId={storyMapId}
                subActionGroupId={subActionGroupId}
                subActions={subActions}
              />
            ))}
          <BaseCard
            style={{ cursor: "default", background: "transparent" }}
            shadow={undefined}
          />
        </Group>
      ))}
    </Group>
  );
}
