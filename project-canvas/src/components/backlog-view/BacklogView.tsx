import {
  Center,
  Divider,
  Flex,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core"
import { useQueries, useQuery } from "@tanstack/react-query"
import { Issue, Sprint } from "project-extender"
import { useEffect, useState } from "react"
import { DragDropContext } from "react-beautiful-dnd"
import { useNavigate } from "react-router-dom"
import { useCanvasStore } from "../../lib/Store"
import { onDragEnd } from "./helpers/draggingHelpers"
import {
  getBacklogIssues,
  getIssuesBySprint,
  getSprints,
} from "./helpers/queryFetchers"
import { resizeDivider } from "./helpers/resizeDivider"
import { DraggableIssuesWrapper } from "./IssuesWrapper/DraggableIssuesWrapper"
import { SprintsPanel } from "./IssuesWrapper/SprintsPanel"
import { ReloadButton } from "./ReloadButton"

export function BacklogView() {
  const navigate = useNavigate()
  const projectName = useCanvasStore((state) => state.selectedProject?.name)
  const projectKey = useCanvasStore((state) => state.selectedProject?.key)
  const boardIds = useCanvasStore((state) => state.selectedProjectBoardIds)
  const currentBoardId = boardIds[0]

  const [issuesWrappers, setIssuesWrappers] = useState(
    new Map<string, { issues: Issue[]; sprint?: Sprint }>()
  )
  const updateIssuesWrapper = (
    key: string,
    value: { issues: Issue[]; sprint?: Sprint }
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
      <Stack align="left" py="xs" spacing="md">
        <Group>
          <Group spacing="xs" c="dimmed">
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
          <ReloadButton ml="auto" mr="xs" />
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
          <ScrollArea.Autosize
            className="left-panel"
            maxHeight="80vh"
            w="50%"
            p="sm"
            sx={{
              minWidth: "260px",
            }}
          >
            {issuesWrappers.get("Backlog") && (
              <DraggableIssuesWrapper
                id="Backlog"
                issues={issuesWrappers.get("Backlog")!.issues}
              />
            )}
          </ScrollArea.Autosize>
          <Divider
            size="xl"
            className="resize-handle"
            orientation="vertical"
            sx={{
              cursor: "col-resize",
            }}
          />
          <ScrollArea.Autosize
            className="right-panel"
            maxHeight="80vh"
            w="50%"
            p="sm"
            sx={{ minWidth: "260px" }}
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
          </ScrollArea.Autosize>
        </DragDropContext>
      </Flex>
    </Stack>
  )
}
