import { useEffect, useState } from "react"
import { DragDropContext } from "react-beautiful-dnd"
import { Box, Divider } from "@mantine/core"
import { Column } from "./Column"
import { Pbi } from "./Item"
import { resizeDivider } from "./resizeDivider"
import { onDragEnd } from "./dndHelpers"

export function BacklogView() {
  const projectName = "oussema"
  const boardId = 1
  const [columns, setColumns] = useState(new Map())
  const [isLoading, setIsLoading] = useState(true)
  const updateColumn = (key: string, value: { id: string; list: Pbi[] }) => {
    setColumns((map) => new Map(map.set(key, value)))
  }

  const getPbis = async () => {
    // Fetch All Sprints to Display them
    await fetch(
      `${import.meta.env.VITE_EXTENDER}/allSprints?boardId=${boardId}`
    ).then(async (response) => {
      // sprintsAsArray = sprint[]
      const sprintsAsArray = await response.json()
      // sprintsArrayToMap = transform the sprintsAsArray in this Form [SprintName , {sprintName, list : Pbis of that Sprint that not Done}]
      const sprintsArrayToMap = await Promise.all(
        sprintsAsArray.map(
          async (sprint: { sprintId: number; sprintName: string }) => {
            const pbisForSprintsResponse = await fetch(
              `${import.meta.env.VITE_EXTENDER}/getIssueForSprint?sprintId=${
                sprint.sprintId
              }`
            )
            const pbisForSprints = await pbisForSprintsResponse.json()
            return [
              sprint.sprintName,
              {
                id: sprint.sprintName,
                list: pbisForSprints.filter(
                  (pbi: { status: string }) => pbi.status !== "Done"
                ),
              },
            ]
          }
        )
      )

      await fetch(
        `${import.meta.env.VITE_EXTENDER}/pbis?project=${projectName}`
      ).then(async (result) => {
        const allPbisForProject = await result.json()
        const Sprintsmap = new Map(sprintsArrayToMap)
        const todoPbisResponse = await fetch(
          `${
            import.meta.env.VITE_EXTENDER
          }/getIssueWithoutSprint?projectId=${projectName}`
        )
        const todoPbis = await todoPbisResponse.json()
        const donePbis = allPbisForProject.filter(
          (pbi: { status: string }) => pbi.status === "Done"
        )
        const todoDoneMap = new Map([
          ["todo", { id: "todo", list: todoPbis }],
          ["done", { id: "done", list: donePbis }],
        ])

        setColumns(
          new Map([
            ...Array.from(Sprintsmap.entries()),
            ...Array.from(todoDoneMap.entries()),
          ])
        )

        setIsLoading(false)
      })
    })
  }
  useEffect(() => {
    getPbis()
  }, [])

  useEffect(() => {
    resizeDivider()
  }, [isLoading])

  const sprints = Array.from(columns.keys())
    .filter((key) => key !== "todo")
    .map((sprint) => <Column col={columns.get(sprint)!} />)
  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <Box sx={{ height: "100%", width: "100%", display: "flex" }}>
      <DragDropContext
        onDragEnd={(dropResult) =>
          onDragEnd({ ...dropResult, columns, updateColumn })
        }
      >
        <Box className="left-panel" sx={{ padding: "5px", width: "50%" }}>
          <Column col={columns.get("todo")!} />
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
          {sprints}
        </Box>
      </DragDropContext>
    </Box>
  )
}
