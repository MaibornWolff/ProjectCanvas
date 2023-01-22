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
  const [isLoading, setIsLoading] = useState(true)
  const [sprints, setSprints] = useState(
    new Map<string, { id: number; startDate: Date; endDate: Date }>()
  )
  const updateSprints = (
    key: string,
    value: { id: number; startDate: Date; endDate: Date }
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
      if (
        currentValue.storyPointsEstimate !== null &&
        currentValue.storyPointsEstimate !== undefined &&
        currentValue.status === status
      ) {
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
            sx={{ padding: "5px", width: "50%", minWidth: "260px" }}
          >
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
              styles={{
                chevron: {
                  "&[data-rotate]": {
                    transform: "rotate(90deg)",
                  },
                },
              }}
            >
              {Array.from(columns.keys())
                .filter((columnName) => columnName !== "Backlog")
                .map((sprint) => (
                  <Accordion.Item
                    key={`Accordion-item-key ${sprint}`}
                    value={sprint}
                    sx={[
                      {
                        border: "1px solid",
                        borderColor: "lightgray",
                        boxShadow: "2px 2px 7px rgba(0, 0, 0, 0.3)",
                      },
                      (theme) => ({
                        backgroundColor: theme.colors.gray[0],
                        "&:hover": {
                          backgroundColor: theme.colors.gray[1],
                        },
                      }),
                    ]}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        paddingRight: "10px",
                      }}
                    >
                      <Accordion.Control
                        key={`Accordion-Control-key ${sprint}`}
                      >
                        {columns.get(sprint)!.id}
                      </Accordion.Control>
                      <Box
                        sx={{
                          display: "flex",
                          gridGap: "2px",
                          alignItems: "center",
                          padding: "2px",
                        }}
                      >
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
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: "20px",
                        paddingBottom: "5px",
                      }}
                    >
                      startDate - endDate
                    </Box>
                    <Accordion.Panel key={`Accordion-Panel-key ${sprint}`}>
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
