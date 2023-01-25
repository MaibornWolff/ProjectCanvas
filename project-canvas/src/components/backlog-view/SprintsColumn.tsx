import { Accordion, Badge, Flex, Group, Title, Text } from "@mantine/core"
import { IconChevronRight } from "@tabler/icons"
import { Issue, Sprint } from "project-extender"
import {
  pluralize,
  sortSprintsByActive,
  storyPointsAccumulator,
} from "./backlogHelper"
import { Column } from "./Column"

export function SprintsColumn({
  columns,
  sprints,
}: {
  columns: Map<string, { id: string; list: Issue[] }>
  sprints: Map<string, Sprint>
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
      {Array.from(columns.keys())
        .filter((columnName) => columnName !== "Backlog")
        .sort((a, b) => sortSprintsByActive(a, b, sprints))
        .map((sprint) => (
          <Accordion.Item key={`accordion-item-key-${sprint}`} value={sprint}>
            <Accordion.Control>
              <Group>
                <Title size="h5">{columns.get(sprint)!.id}</Title>
                <Text color="dimmed">
                  {pluralize(columns.get(sprint)!.list.length, "issue")}
                </Text>
                {sprints.get(sprint)?.state === "active" && (
                  <Badge px="6px" color="green" variant="filled" size="sm">
                    active
                  </Badge>
                )}
                <Flex gap={4} p="xs" ml="auto">
                  <Badge px="6px" color="gray.6" variant="filled" size="sm">
                    {storyPointsAccumulator(columns.get(sprint)!.list, "To Do")}
                  </Badge>
                  <Badge
                    px="6px"
                    color="blue.8"
                    variant="filled"
                    size="sm"
                    sx={{ align: "left" }}
                  >
                    {storyPointsAccumulator(
                      columns.get(sprint)!.list,
                      "In Progress"
                    )}
                  </Badge>
                  <Badge px="6px" color="green.9" variant="filled" size="sm">
                    {storyPointsAccumulator(columns.get(sprint)!.list, "Done")}
                  </Badge>
                </Flex>
              </Group>
              <Text size="sm" color="gray.7">
                {sprints.get(sprint)!.startDate.toString() === "Invalid Date"
                  ? "Dates not defined"
                  : sprints.get(sprint)!.startDate.toString()}
                {sprints.get(sprint)!.endDate.toString() === "Invalid Date"
                  ? ""
                  : ` · ${sprints.get(sprint)!.endDate.toString()}`}
              </Text>
            </Accordion.Control>

            <Accordion.Panel>
              <Column col={columns.get(sprint)!} />
            </Accordion.Panel>
          </Accordion.Item>
        ))}
    </Accordion>
  )
}
