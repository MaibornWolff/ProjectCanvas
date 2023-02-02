import { Accordion, Badge, Flex, Group, Text, Title } from "@mantine/core"
import { IconChevronRight } from "@tabler/icons"
import { Issue, Sprint } from "project-extender"
import {
  pluralize,
  sortSprintsByActive,
  storyPointsAccumulator,
} from "../helpers/backlogHelpers"
import { DraggableIssuesWrapper } from "./DraggableIssuesWrapper"

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
            backgroundColor: theme.colors.gray[1],
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
          <Badge px="6px" color="gray.6" variant="filled" size="sm">
            {storyPointsAccumulator(issues, "To Do")}
          </Badge>
          <Badge px="6px" color="blue.8" variant="filled" size="sm">
            {storyPointsAccumulator(issues, "In Progress")}
          </Badge>
          <Badge px="6px" color="green.9" variant="filled" size="sm">
            {storyPointsAccumulator(issues, "Done")}
          </Badge>
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
