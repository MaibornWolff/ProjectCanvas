import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { DragDropContext } from "react-beautiful-dnd"
import {
  Box,
  Container,
  Divider,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core"
import { Issue } from "project-extender"
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
  const [sprints, setSprints] = useState(new Map<string, number>())
  const updateSprints = (key: string, value: number) => {
    setSprints((map) => new Map(map.set(key, value)))
  }
  const [columns, setColumns] = useState(
    new Map<string, { id: string; list: Issue[] }>()
  )
  const updateColumn = (key: string, value: { id: string; list: Issue[] }) => {
    setColumns((map) => new Map(map.set(key, value)))
  }

  const getIssues = async () => {
    await Promise.all(
      boardIds.map(async (boardId) => {
        const sprintsResponse = await fetch(
          `${import.meta.env.VITE_EXTENDER}/sprintsByBoardId?boardId=${boardId}`
        )
        const sprintsAsArray = await sprintsResponse.json()
        await Promise.all(
          sprintsAsArray.map(
            async (sprint: { sprintId: number; sprintName: string }) => {
              updateSprints(sprint.sprintName, sprint.sprintId)
              const issuesForSprintResponse = await fetch(
                `${
                  import.meta.env.VITE_EXTENDER
                }/issuesBySprintAndProject?sprint=${
                  sprint.sprintId
                }&project=${projectKey}`
              )
              const issuesForSprints = await issuesForSprintResponse.json()

              updateColumn(sprint.sprintName, {
                id: sprint.sprintName,
                list: issuesForSprints.filter(
                  (issue: Issue) =>
                    issue.type !== "Epic" && issue.type !== "Subtask"
                ),
              })
            }
          )
        )
        const backlogIssues = await fetch(
          `${
            import.meta.env.VITE_EXTENDER
          }/backlogIssuesByProjectAndBoard?project=${projectKey}&boardId=${boardId}`
        )
        const unassignedPbis = await backlogIssues.json()
        updateColumn("Backlog", {
          id: "Backlog",
          list: unassignedPbis.filter(
            (issue: Issue) => issue.type !== "Epic" && issue.type !== "Subtask"
          ),
        })
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
    <Text>Loading...</Text>
  ) : (
    <Container sx={{ maxWidth: "100%" }}>
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

      <Box sx={{ height: "100%", width: "100%", display: "flex" }}>
        <DragDropContext
          onDragEnd={(dropResult) =>
            onDragEnd({ ...dropResult, columns, updateColumn, sprints })
          }
        >
          <Box
            className="left-panel"
            sx={{
              height: "600px",
              padding: "5px",
              width: "50%",
              minWidth: "300px",
              overflow: "auto",
            }}
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
            sx={{
              height: "600px",
              padding: "5px",
              width: "50%",
              minWidth: "300px",
              overflow: "auto",
            }}
          >
            {Array.from(columns.keys())
              .filter((columnName) => columnName !== "Backlog")
              .map((sprint) => (
                <Column key={sprint} col={columns.get(sprint)!} />
              ))}
          </Box>
        </DragDropContext>
      </Box>
    </Container>
  )
}
