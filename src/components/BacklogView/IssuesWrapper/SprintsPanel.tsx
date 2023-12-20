import { Accordion, Badge, Flex, Group, Text, Title } from "@mantine/core"
import { IconChevronRight } from "@tabler/icons"
import { Issue, Sprint } from "types"
import {
  pluralize,
  sortSprintsByActive,
  storyPointsAccumulator,
} from "../helpers/backlogHelpers"
import { DraggableIssuesWrapper } from "./DraggableIssuesWrapper"
import {StatusType} from "../../../../types/status";
import {StoryPointsBadge} from "../../common/StoryPoints/StoryPointsBadge";

export function SprintsPanel({
  sprintsWithIssues,
}: {
  sprintsWithIssues: { issues: Issue[]; sprint: Sprint }[]
}) {
  return (
    <Accordion
      variant="separated"
      radius="md"
      chevron={<IconChevronRight />}
      chevronPosition="left"
      multiple
      styles={(theme) => ({
        chevron: {
          "&[data-rotate]": {
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
              theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
          },
        },
      })}
    >
      {sprintsWithIssues
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
  )
}

function SprintAccordionControl({
  issues,
  sprint,
}: {
  issues: Issue[]
  sprint: Sprint
}) {
  return (
    <Accordion.Control>
      <Group>
        <Title size="h5">{sprint.name}</Title>
        <Text color="dimmed">{pluralize(issues.length, "issue")}</Text>
        {sprint.state === "active" && (
          <Badge px="6px" color="green" variant="filled" size="sm">
            active
          </Badge>
        )}
        <Flex gap={4} p="xs" ml="auto">
          <StoryPointsBadge
            statusType={StatusType.TODO}
            storyPointsEstimate={storyPointsAccumulator(issues, StatusType.TODO)}
          />
          <StoryPointsBadge
            statusType={StatusType.IN_PROGRESS}
            storyPointsEstimate={storyPointsAccumulator(issues, StatusType.IN_PROGRESS)}
          />
          <StoryPointsBadge
            statusType={StatusType.DONE}
            storyPointsEstimate={storyPointsAccumulator(issues, StatusType.DONE)}
          />
        </Flex>
      </Group>
      <Text size="sm" color="gray.7">
        {sprint.startDate.toString() === "Invalid Date"
          ? "Dates not defined"
          : sprint.startDate.toString()}
        {sprint.endDate.toString() === "Invalid Date"
          ? ""
          : ` · ${sprint.endDate.toString()}`}
      </Text>
    </Accordion.Control>
  )
}
