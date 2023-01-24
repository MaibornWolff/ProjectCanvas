import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { DragDropContext } from "react-beautiful-dnd"
import {
  Accordion,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Title,
  Badge,
  Loader,
  Center,
  Group,
  Text,
} from "@mantine/core"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons"
import { Issue, Sprint } from "project-extender"
import { Column } from "./Column"
import { resizeDivider } from "./resizeDivider"
import { onDragEnd } from "./dndHelpers"
import { useCanvasStore } from "../../lib/Store"

export function BacklogView() {
  const navigate = useNavigate()
  const projectName = useCanvasStore((state) => state.selectedProject?.name)
  const projectKey = useCanvasStore((state) => state.selectedProject?.key)
  const boardIds = useCanvasStore((state) => state.selectedProjectBoardIds)
  const pluralize = (count: number, noun: string, suffix = "s") =>
    `${count} ${noun}${count !== 1 ? suffix : ""}`
  const [isLoading, setIsLoading] = useState(true)
  const [sprints, setSprints] = useState(
    new Map<
      string,
      {
        id: number
        state: string
        startDate: Intl.DateTimeFormat
        endDate: Intl.DateTimeFormat
      }
    >()
  )
  const updateSprints = (
    key: string,
    value: {
      id: number
      state: string
      startDate: Intl.DateTimeFormat
      endDate: Intl.DateTimeFormat
    }
  ) => {
    setSprints((map) => new Map(map.set(key, value)))
  }
  const [columns, setColumns] = useState(
    new Map<string, { id: string; list: Issue[] }>()
  )
  const updateColumn = (key: string, value: { id: string; list: Issue[] }) => {
    setColumns((map) => new Map(map.set(key, value)))
  }

  const storyPointsAccumulator = (issues: Issue[], status: string) =>
    issues.reduce((accumulator, currentValue) => {
      if (currentValue.storyPointsEstimate && currentValue.status === status) {
        return accumulator + currentValue.storyPointsEstimate
      }
      return accumulator
    }, 0)

  const getIssues = async () => {
    await Promise.all(
      boardIds.map(async (boardId) => {
        const sprintsResponse = await fetch(
          `${import.meta.env.VITE_EXTENDER}/sprintsByBoardId?boardId=${boardId}`
        )
        const sprintsAsArray = await sprintsResponse.json()
        await Promise.all(
          sprintsAsArray.map(async (sprint: Sprint) => {
            updateSprints(sprint.name, {
              id: sprint.id,
              state: sprint.state,
              startDate: sprint.startDate,
              endDate: sprint.endDate,
            })
            const issuesForSprintResponse = await fetch(
              `${
                import.meta.env.VITE_EXTENDER
              }/issuesBySprintAndProject?sprint=${
                sprint.id
              }&project=${projectKey}`
            )
            const issuesForSprints = await issuesForSprintResponse.json()
            updateColumn(sprint.name, {
              id: sprint.name,
              list: issuesForSprints,
            })
          })
        )
        const backlogIssues = await fetch(
          `${
            import.meta.env.VITE_EXTENDER
          }/backlogIssuesByProjectAndBoard?project=${projectKey}&boardId=${boardId}`
        )
        const unassignedPbis = await backlogIssues.json()
        updateColumn("Backlog", { id: "Backlog", list: unassignedPbis })
      })
    )
    setIsLoading(false)
  }

  useEffect(() => {
    getIssues()
  }, [])

  useEffect(() => {
    resizeDivider()
  }, [isLoading])

  return isLoading ? (
    <Center style={{ width: "100%", height: "100%" }}>
      <Loader />
    </Center>
  ) : (
    <Container>
      <Flex
        align="center"
        gap="xl"
        sx={{ paddingBottom: "10px", paddingTop: "30px" }}
      >
        <Button
          leftIcon={<IconChevronLeft />}
          onClick={() => navigate("/projectsview")}
          sx={{ flex: 1 }}
        >
          Back
        </Button>
        <Title sx={{ flex: 2 }} order={2} color="blue.7">
          project: {projectName}
        </Title>
      </Flex>
      <Divider size="xl" />
      <Box sx={{ height: "100%", width: "100%", display: "flex" }}>
        <DragDropContext
          onDragEnd={(dropResult) =>
            onDragEnd({ ...dropResult, columns, updateColumn, sprints })
          }
        >
          <Box
            className="left-panel"
            sx={{
              padding: "5px",
              width: "50%",
              minWidth: "260px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Title size="h4">Backlog</Title>
            <Column col={columns.get("Backlog")!} />
          </Box>
          <Divider
            className="resize-handle"
            size="xl"
            orientation="vertical"
            sx={{
              cursor: "col-resize",
            }}
          />
          <Box
            className="right-panel"
            sx={{ padding: "5px", width: "50%", minWidth: "260px" }}
          >
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
                .sort((a, b) => {
                  if (
                    sprints.get(a)!.state === "active" &&
                    sprints.get(b)!.state !== "active"
                  ) {
                    return -1
                  }
                  if (
                    sprints.get(a)!.state !== "active" &&
                    sprints.get(b)!.state === "active"
                  ) {
                    return 1
                  }
                  return a.localeCompare(b)
                })
                .map((sprint) => (
                  <Accordion.Item
                    key={`accordion-item-key-${sprint}`}
                    value={sprint}
                  >
                    <Accordion.Control>
                      <Group>
                        <Title size="h5">{columns.get(sprint)!.id}</Title>
                        <Text color="dimmed">
                          {pluralize(columns.get(sprint)!.list.length, "issue")}
                        </Text>
                        {sprints.get(sprint)?.state === "active" && (
                          <Badge
                            px="6px"
                            color="green"
                            variant="filled"
                            size="sm"
                          >
                            active
                          </Badge>
                        )}
                        <Flex gap={4} p="xs" ml="auto">
                          <Badge
                            px="6px"
                            color="gray.6"
                            variant="filled"
                            size="sm"
                          >
                            {storyPointsAccumulator(
                              columns.get(sprint)!.list,
                              "To Do"
                            )}
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
                          <Badge
                            px="6px"
                            color="green.9"
                            variant="filled"
                            size="sm"
                          >
                            {storyPointsAccumulator(
                              columns.get(sprint)!.list,
                              "Done"
                            )}
                          </Badge>
                        </Flex>
                      </Group>
                      <Text size="sm" color="gray.7">
                        {sprints.get(sprint)!.startDate.toString() ===
                        "Invalid Date"
                          ? "Dates not defined"
                          : sprints.get(sprint)!.startDate.toString()}
                        {sprints.get(sprint)!.endDate.toString() ===
                        "Invalid Date"
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
          </Box>
        </DragDropContext>
      </Box>
    </Container>
  )
}
