import {
  Box,
  Center,
  Divider,
  Flex,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core"
import { Issue, Sprint } from "project-extender"
import { useEffect, useState } from "react"
import { useQueries, useQuery } from "@tanstack/react-query"
import { DragDropContext } from "react-beautiful-dnd"
import { useNavigate } from "react-router-dom"
import { useCanvasStore } from "../../lib/Store"
import { onDragEnd } from "./dndHelpers"
import { getBacklogIssues, getIssuesBySprint, getSprints } from "./issueFetcher"
import { resizeDivider } from "./resizeDivider"
import { DraggableIssuesWrapper } from "./DraggableIssuesWrapper"
import { SprintsPanel } from "./SprintsPanel"

export function BacklogView() {
  const navigate = useNavigate()
  const projectName = useCanvasStore((state) => state.selectedProject?.name)
  const projectKey = useCanvasStore((state) => state.selectedProject?.key)
  const boardIds = useCanvasStore((state) => state.selectedProjectBoardIds)
  const currentBoardId = boardIds[0]

  const [issuesWrappers, setIssuesWrappers] = useState(
    new Map<string, { id: string; issues: Issue[]; sprint?: Sprint }>()
  )
  const updateIssuesWrapper = (
    key: string,
    value: { id: string; issues: Issue[]; sprint?: Sprint }
  ) => {
    setIssuesWrappers((map) => new Map(map.set(key, value)))
  }

  const { isLoading, data: sprints } = useQuery({
    queryKey: ["sprints", currentBoardId],
    queryFn: () => getSprints(currentBoardId),
    enabled: !!currentBoardId,
  })

  const issuesQueries = useQueries({
    queries:
      sprints?.map((sprint) => ({
        queryKey: ["issues", "sprints", projectKey, sprints, sprint.id],
        queryFn: () => getIssuesBySprint(projectKey, sprint.id),
        enabled: !!projectKey && !!sprints,
      })) ?? [],
  })

  const { data: issues } = useQuery({
    queryKey: ["issues", "sprints", projectKey, sprints],
    queryFn: () => getIssuesBySprint(projectKey, sprints![0].id),
    enabled: !!projectKey && !!sprints,
  })

  const { data: backlogIssues } = useQuery({
    queryKey: ["issues", projectKey, currentBoardId],
    queryFn: () => getBacklogIssues(projectKey, currentBoardId),
    enabled: !!projectKey,
  })

  useEffect(() => {
    if (issuesQueries && sprints) {
      issuesQueries.forEach((issuesQuerie, index) => {
        const sprint = sprints[index]
        const sprintIssues = issuesQuerie.data
        if (sprintIssues) {
          updateIssuesWrapper(sprint.name, {
            id: sprint.name,
            issues: sprintIssues.filter(
              (issue: Issue) =>
                issue.type !== "Epic" && issue.type !== "Subtask"
            ),
            sprint,
          })
        }
      })
    }

    if (backlogIssues) {
      updateIssuesWrapper("Backlog", {
        id: "Backlog",
        sprint: undefined,
        issues: backlogIssues.filter(
          (issue: Issue) => issue.type !== "Epic" && issue.type !== "Subtask"
        ),
      })
    }
  }, [sprints, issues])

  useEffect(() => {
    resizeDivider()
  }, [isLoading])

  if (isLoading)
    return (
      <Center style={{ width: "100%", height: "100%" }}>
        <Loader />
      </Center>
    )

  if (backlogIssues)
    return (
      <Stack sx={{ minHeight: "100%" }}>
        <Stack
          align="left"
          sx={{
            paddingBottom: "10px",
            paddingTop: "10px",
            gap: "10px",
          }}
        >
          <Group sx={{ gap: "5px", color: "#6B778C" }}>
            <Text
              onClick={() => navigate("/projectsview")}
              sx={{
                ":hover": {
                  textDecoration: "underline",
                  cursor: "pointer",
                },
              }}
            >
              Projects
            </Text>
            <Text>/</Text>
            <Text>{projectName}</Text>
          </Group>
          <Title>Backlog</Title>
        </Stack>

        <Flex sx={{ flexGrow: 1 }}>
          <DragDropContext
            onDragEnd={(dropResult) =>
              onDragEnd({
                ...dropResult,
                issuesWrappers,
                updateIssuesWrapper,
              })
            }
          >
            <Box
              className="left-panel"
              w="50%"
              h={600}
              p="sm"
              sx={{
                minWidth: "260px",
                overflow: "auto",
              }}
            >
              {issuesWrappers.get("Backlog") && (
                <DraggableIssuesWrapper
                  id={issuesWrappers.get("Backlog")!.id}
                  issues={issuesWrappers.get("Backlog")!.issues}
                />
              )}
            </Box>
            <Divider
              size="xl"
              className="resize-handle"
              orientation="vertical"
              sx={{
                cursor: "col-resize",
              }}
            />
            <Box
              className="right-panel"
              h={1000}
              w="50%"
              p="sm"
              sx={{ minWidth: "260px", overflow: "auto" }}
            >
              <SprintsPanel
                sprintsWithIssues={
                  Array.from(issuesWrappers.values()).filter(
                    (issuesWrapper) => issuesWrapper.sprint !== undefined
                  ) as unknown as {
                    id: string
                    issues: Issue[]
                    sprint: Sprint
                  }[]
                }
              />
            </Box>
          </DragDropContext>
        </Flex>
      </Stack>
    )

  return <Box>Nothing</Box>
}
