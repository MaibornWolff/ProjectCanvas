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
import {
  getBacklogIssues,
  getIssuesBySprint,
  getSprints,
} from "./helpers/queryFetchers"
import { DraggableIssuesWrapper } from "./IssuesWrapper/DraggableIssuesWrapper"
import { SprintsPanel } from "./IssuesWrapper/SprintsPanel"
import { onDragEnd } from "./helpers/draggingHelpers"
import { resizeDivider } from "./helpers/resizeDivider"

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

  const { data: sprints } = useQuery({
    queryKey: ["sprints", currentBoardId],
    queryFn: () => getSprints(currentBoardId),
    enabled: !!currentBoardId,
  })

  useQueries({
    queries:
      sprints?.map((sprint) => ({
        queryKey: ["issues", "sprints", projectKey, sprints, sprint.id],
        queryFn: () => getIssuesBySprint(projectKey, sprint.id),
        enabled: !!projectKey && !!sprints,
        onSuccess: (issues: Issue[]) => {
          updateIssuesWrapper(sprint.name, {
            id: sprint.name,
            sprint,
            issues: issues.filter(
              (issue: Issue) =>
                issue.type !== "Epic" && issue.type !== "Subtask"
            ),
          })
        },
      })) ?? [],
  })

  const { isLoading: isLoadingBacklogIssues } = useQuery({
    queryKey: ["issues", projectKey, currentBoardId],
    queryFn: () => getBacklogIssues(projectKey, currentBoardId),
    enabled: !!projectKey,
    onSuccess: (backlogIssues) => {
      updateIssuesWrapper("Backlog", {
        id: "Backlog",
        sprint: undefined,
        issues: backlogIssues.filter(
          (issue: Issue) => issue.type !== "Epic" && issue.type !== "Subtask"
        ),
      })
    },
  })

  useEffect(() => {
    resizeDivider()
  }, [isLoadingBacklogIssues])

  if (isLoadingBacklogIssues)
    return (
      <Center style={{ width: "100%", height: "100%" }}>
        <Loader />
      </Center>
    )

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
}
