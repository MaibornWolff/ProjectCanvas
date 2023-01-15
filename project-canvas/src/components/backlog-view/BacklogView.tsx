import { useEffect, useState } from "react"
import { DragDropContext } from "react-beautiful-dnd"
import { Column } from "./Column"
import { Pbi } from "./Item"
// import { data } from "./pbiData"
import "./BacklogView.css"
import { resizeDivider } from "./resizeDivider"
import { onDragEnd } from "./dndHelpers"

export function BacklogView() {
  const projectName = "Canvas"
  const [columns, setColumns] = useState(new Map())
  const [isLoading, setIsLoading] = useState(true)
  const updateColumns = (key: string, value: { id: string; list: Pbi[] }) => {
    setColumns((map) => new Map(map.set(key, value)))
  }
  const getPbis = async () => {
    await fetch(
      `${import.meta.env.VITE_EXTENDER}/pbis?project=${projectName}`
    ).then(async (result) => {
      const pbis = await result.json()
      setColumns(
        new Map([
          [
            "todo",
            {
              id: "todo",
              list: pbis,
            },
          ],
          [
            "doing",
            {
              id: "doing",
              list: [],
            },
          ],
          [
            "done",
            {
              id: "done",
              list: [],
            },
          ],
        ])
      )
      setIsLoading(false)
    })
  }

  useEffect(() => {
    resizeDivider()
    getPbis()
  }, [])

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div className="container">
      <DragDropContext
        onDragEnd={(dropResult) =>
          onDragEnd({ ...dropResult, columns, updateColumns })
        }
      >
        <div className="left-panel">
          <Column col={columns.get("todo")!} />
        </div>
        <div className="right-panel">
          <Column col={columns.get("doing")!} />
          <Column col={columns.get("done")!} />
        </div>
      </DragDropContext>
    </div>
  )
}
