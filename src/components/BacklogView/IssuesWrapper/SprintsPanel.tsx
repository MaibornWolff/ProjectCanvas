import { Accordion, Badge, Flex, Group, Text, Title } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { Issue, Sprint } from "types";
import { pluralize, sortSprintsByActive } from "../helpers/backlogHelpers";
import { DraggableIssuesWrapper } from "./DraggableIssuesWrapper";
import { StatusType } from "../../../../types/status";
import { StoryPointsBadge } from "../../common/StoryPoints/StoryPointsBadge";
import { useColorScheme } from "../../../common/color-scheme";
import { storyPointsAccumulator } from "../../common/StoryPoints/status-accumulator";
import { useCanvasStore } from "../../../lib/Store";

export function SprintsPanel({
  sprints,
  issueWrapper,
}: {
  sprints: { [_: string]: Sprint };
  issueWrapper: { [_: string]: Issue[] };
}) {
  const colorScheme = useColorScheme();

  return (
    <Accordion
      variant="separated"
      radius="md"
      chevron={<IconChevronRight />}
      chevronPosition="left"
      multiple
      style={(theme) => ({
        chevron: {
          "&[dataRotate]": {
            transform: "rotate(90deg)",
          },
        },
        control: {
          padding: theme.spacing.xs,
        },
        item: {
          border: "solid 1px lightgray",
          "&:hover": {
            background:
              colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
          },
        },
      })}
    >
      {Object.keys(issueWrapper)
        .map((sprintId) => ({
          issues: issueWrapper[sprintId],
          sprint: sprints[sprintId],
        }))
        .sort(({ sprint: sprintA }, { sprint: sprintB }) =>
          sortSprintsByActive(sprintA, sprintB)
        )
        .map(({ issues, sprint }) => (
          <Accordion.Item
            key={`accordion-item-key-${sprint.name}`}
            value={sprint.name}
            mr={2}
          >
            <SprintAccordionControl issues={issues} sprint={sprint} />

            <Accordion.Panel>
              <DraggableIssuesWrapper id={sprint.name} issues={issues} />
            </Accordion.Panel>
          </Accordion.Item>
        ))}
    </Accordion>
  );
}

function SprintAccordionControl({
  issues,
  sprint,
}: {
  issues: Issue[];
  sprint: Sprint;
}) {
  const { issueStatusByCategory } = useCanvasStore();

  const getStatusNamesInCategory = (category: StatusType) =>
    issueStatusByCategory[category]?.map((s) => s.name) ?? [];

  return (
    <Accordion.Control>
      <Group>
        <Title size="h5">{sprint.name}</Title>
        <Text c="dimmed">{pluralize(issues.length, "issue")}</Text>
        {sprint.state === "active" && (
          <Badge px="6px" color="green" variant="filled" size="sm">
            active
          </Badge>
        )}
        <Flex gap={4} p="xs" ml="auto">
          <StoryPointsBadge
            statusType={StatusType.TODO}
            storyPointsEstimate={storyPointsAccumulator(
              issues,
              getStatusNamesInCategory(StatusType.TODO)
            )}
          />
          <StoryPointsBadge
            statusType={StatusType.IN_PROGRESS}
            storyPointsEstimate={storyPointsAccumulator(
              issues,
              getStatusNamesInCategory(StatusType.IN_PROGRESS)
            )}
          />
          <StoryPointsBadge
            statusType={StatusType.DONE}
            storyPointsEstimate={storyPointsAccumulator(
              issues,
              getStatusNamesInCategory(StatusType.DONE)
            )}
          />
        </Flex>
      </Group>
      <Text size="sm" c="gray.7">
        {sprint.startDate.toString() === "Invalid Date"
          ? "Dates not defined"
          : sprint.startDate.toString()}
        {sprint.endDate.toString() === "Invalid Date"
          ? ""
          : ` · ${sprint.endDate.toString()}`}
      </Text>
    </Accordion.Control>
  );
}
