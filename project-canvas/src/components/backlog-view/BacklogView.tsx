import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { DragDropContext } from "react-beautiful-dnd"
import { Box, Button, Text, Container, Divider, Flex } from "@mantine/core"
import { IconChevronLeft } from "@tabler/icons"
import { Column } from "./Column"
import { Pbi } from "./Item"
import { resizeDivider } from "./resizeDivider"
import { onDragEnd } from "./dndHelpers"
import { useProjectStore } from "../projects-view/ProjectsTable"

export function BacklogView() {
  const projectName = useProjectStore((state) => state.selectedProject?.name)
  const projectKey = useProjectStore((state) => state.selectedProject?.key)
  const navigate = useNavigate()
  const boardIds = useProjectStore((state) => state.selectedProjectBoards)
  const [columns, setColumns] = useState(
    new Map<string, { id: string; list: Pbi[] }>()
  )
  const [isLoading, setIsLoading] = useState(true)
  const updateColumn = (key: string, value: { id: string; list: Pbi[] }) => {
    setColumns((map) => new Map(map.set(key, value)))
  }

  const getPbis = async () => {
    // Fetch All Sprints to Display them
    await Promise.all(
      boardIds.map(async (boardId) => {
        const sprintsResponse = await fetch(
          `${import.meta.env.VITE_EXTENDER}/allSprints?boardId=${boardId}`
        )
        // sprintsAsArray : Sprint[]
        const sprintsAsArray = await sprintsResponse.json()
        // sprintsArrayToMap() = transform the sprintsAsArray in this Form [SprintName , {sprintName, list : Pbis of that Sprint that not Done}]
        await Promise.all(
          sprintsAsArray.map(
            async (sprint: { sprintId: number; sprintName: string }) => {
              const issuesForSprintResponse = await fetch(
                `${import.meta.env.VITE_EXTENDER}/getIssueForSprint?sprintId=${
                  sprint.sprintId
                }&project=${projectKey}`
              )
              const issuesForSprints = await issuesForSprintResponse.json()
              updateColumn(sprint.sprintName, {
                id: sprint.sprintName,
                list: issuesForSprints.filter(
                  (pbi: { status: string }) => pbi.status !== "Done"
                ),
              })
            }
          )
        )

        // get backlog for this boardId (unassigned pbis) and Done Pbis
        const unassignedPbisResponse = await fetch(
          `${
            import.meta.env.VITE_EXTENDER
          }/getBacklogPbisForProject?project=${projectKey}&boardId=${boardId}`
        )
        // these are all Pbis unassigned to any sprint for the current boardId and project
        const unassignedPbis = await unassignedPbisResponse.json()
        updateColumn("Unassigned", { id: "Unassigned", list: unassignedPbis })
      })
    )

    const donePbisResponse = await fetch(
      `${
        import.meta.env.VITE_EXTENDER
      }/getDonePBIsForProject?project=${projectKey}`
    )
    const donePbis = await donePbisResponse.json()

    updateColumn("Done", { id: "Done", list: donePbis })

    setIsLoading(false)
  }

  useEffect(() => {
    getPbis()
  }, [])

  useEffect(() => {
    resizeDivider()
  }, [isLoading])

  const sprintsAndDone = Array.from(columns.keys())
    .filter((key) => key !== "Unassigned")
    .map((sprint) => <Column col={columns.get(sprint)!} />)

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <Container>
      <Flex align="center" gap="xl">
        <Button
          leftIcon={<IconChevronLeft />}
          onClick={() => navigate("/projectsview")}
          sx={{ flex: 1 }}
        >
          Back
        </Button>
        <Text sx={{ flex: 2 }}>project: {projectName}</Text>
      </Flex>
      <Box sx={{ height: "100%", width: "100%", display: "flex" }}>
        <DragDropContext
          onDragEnd={(dropResult) =>
            onDragEnd({ ...dropResult, columns, updateColumn })
          }
        >
          <Box className="left-panel" sx={{ padding: "5px", width: "50%" }}>
            <Column col={columns.get("Unassigned")!} />
          </Box>
          <Divider
            className="resize-handle"
            size="xl"
            orientation="vertical"
            sx={{
              cursor: "col-resize",
            }}
          />
          <Box className="right-panel" sx={{ padding: "5px", width: "50%" }}>
            {sprintsAndDone}
          </Box>
        </DragDropContext>
      </Box>
    </Container>
  )
}
