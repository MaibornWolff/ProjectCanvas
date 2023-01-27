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
import { useQuery } from "@tanstack/react-query"
import { DragDropContext } from "react-beautiful-dnd"
import { useNavigate } from "react-router-dom"
import { useCanvasStore } from "../../lib/Store"
import { Column } from "./Column"
import { onDragEnd } from "./dndHelpers"
import { getBacklogIssues, getIssuesBySprint, getSprints } from "./issueFetcher"
import { resizeDivider } from "./resizeDivider"
import { SprintsColumn } from "./SprintsColumn"

export function BacklogView() {
  const navigate = useNavigate()
  const projectName = useCanvasStore((state) => state.selectedProject?.name)
  const projectKey = useCanvasStore((state) => state.selectedProject?.key)
  const boardIds = useCanvasStore((state) => state.selectedProjectBoardIds)
  const currentBoardId = boardIds[0]
  const [sprints, setSprints] = useState(new Map<string, Sprint>())
  const [columns, setColumns] = useState(
    new Map<string, { id: string; list: Issue[] }>()
  )
  const updateSprints = (key: string, value: Sprint) => {
    setSprints((map) => new Map(map.set(key, value)))
  }
  const updateColumn = (key: string, value: { id: string; list: Issue[] }) => {
    setColumns((map) => new Map(map.set(key, value)))
  }

  const { isLoading, data: sprintsLog } = useQuery({
    queryKey: ["sprints", currentBoardId],
    queryFn: () => getSprints(currentBoardId),
    enabled: !!currentBoardId,
  })

  const { data: issuesLog } = useQuery({
    queryKey: ["issues", "sprints", projectKey, sprintsLog],
    queryFn: () => getIssuesBySprint(projectKey, sprintsLog![0].id),
    enabled: !!sprintsLog && !!projectKey,
  })

  const { data: backlogIssues } = useQuery({
    queryKey: ["issues", projectKey, currentBoardId],
    queryFn: () => getBacklogIssues(projectKey, currentBoardId),
    enabled: !!projectKey,
  })

  useEffect(() => {
    console.log(sprintsLog)
    console.log(backlogIssues)
    console.log(issuesLog)

    if (sprintsLog && issuesLog) {
      updateSprints(sprintsLog[0].name, {
        id: sprintsLog[0].id,
        name: sprintsLog[0].name,
        state: sprintsLog[0].state,
        startDate: sprintsLog[0].startDate,
        endDate: sprintsLog[0].endDate,
      })
      updateColumn(sprintsLog[0].name, {
        id: sprintsLog[0].name,
        list: issuesLog.filter(
          (issue: Issue) => issue.type !== "Epic" && issue.type !== "Subtask"
        ),
      })
    }
  }, [sprintsLog, issuesLog])

  // useEffect(() => {
  //   getIssues(projectKey, boardIds, updateColumn, updateSprints, setIsLoading)
  // }, [])

  useEffect(() => {
    resizeDivider()
  }, [isLoading])

  return isLoading ? (
    <Center style={{ width: "100%", height: "100%" }}>
      <Loader />
    </Center>
  ) : (
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
            onDragEnd({ ...dropResult, columns, updateColumn, sprints })
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
            <Column col={columns.get("Backlog")!} />
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
            h={600}
            w="50%"
            p="sm"
            sx={{ minWidth: "260px", overflow: "auto" }}
          >
            <SprintsColumn columns={columns} sprints={sprints} />
          </Box>
        </DragDropContext>
      </Flex>
    </Stack>
  )
}
