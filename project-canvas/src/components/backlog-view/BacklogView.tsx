import { useEffect, useState } from "react"
import { DragDropContext, DropResult } from "react-beautiful-dnd"
import { Column } from "./Column"
import { Pbi } from "./Item"
// import { data } from "./pbiData"
import "./BacklogView.css"

export function BacklogView() {
  useEffect(() => {
    const leftPanel: HTMLElement | null = document.querySelector(".left-panel")
    const rightPanel: HTMLElement | null =
      document.querySelector(".right-panel")
    const resizeHandle: HTMLElement | null =
      document.querySelector(".resize-handle")

    let isDragging = false
    let currentX: number
    let initialLeftWidth: number
    let initialRightWidth: number

    resizeHandle?.addEventListener("mousedown", (event) => {
      isDragging = true
      currentX = event.clientX
      initialLeftWidth = leftPanel!.offsetWidth
      initialRightWidth = rightPanel!.offsetWidth
    })

    document.addEventListener("mousemove", (event) => {
      if (!isDragging) {
        return
      }

      const deltaX = event.clientX - currentX
      const newLeftWidth = initialLeftWidth + deltaX
      const newRightWidth = initialRightWidth - deltaX

      leftPanel!.style.width = `${newLeftWidth}px`
      rightPanel!.style.width = `${newRightWidth}px`
    })

    document.addEventListener("mouseup", () => {
      isDragging = false
    })
  }, [])

  const projectName = "Canvas"

  const [pbis, setPbis] = useState<Pbi[]>([])
  const getPbis = async () => {
    const pbiData = await fetch(
      `${import.meta.env.VITE_EXTENDER}/pbis?project=${projectName}`
    )
    setPbis(await pbiData.json())
    // console.log("setting pbis, here is pbiData.json")
    // console.log(await pbiData.json())
  }
  useEffect(() => {
    getPbis()
    // console.log("getPbis")
  }, [])

  const initialColumns = new Map([
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

  const [columns, setColumns] = useState(initialColumns)

  const onDragEnd = ({ source, destination }: DropResult) => {
    // Make sure we have a valid destination
    if (destination === undefined || destination === null) return null

    // Make sure we're actually moving the item
    if (
      source.droppableId === destination.droppableId &&
      destination.index === source.index
    )
      return null

    // Set start and end variables
    const start = columns.get(source.droppableId)
    const end = columns.get(destination.droppableId)

    // If start is the same as end, we're in the same column
    if (start === end) {
      // Move the item within the list
      // Start by making a new list without the dragged item
      const newList = start!.list.filter(
        (_: Pbi, idx: number) => idx !== source.index
      )

      // Then insert the item at the right location
      newList.splice(destination.index, 0, start!.list[source.index])

      // Then create a new copy of the column object
      const newCol = {
        id: start!.id,
        list: newList,
      }

      // Update the state
      setColumns((state) => ({ ...state, [newCol.id]: newCol }))
      return null
    }
    // If start is different from end, we need to update multiple columns
    // Filter the start list like before
    const newStartList = start!.list.filter(
      (_: Pbi, idx: number) => idx !== source.index
    )

    // Create a new start column
    const newStartCol = {
      id: start!.id,
      list: newStartList,
    }

    // Make a new end list array
    const newEndList = end!.list

    // Insert the item into the end list
    newEndList.splice(destination.index, 0, start!.list[source.index])

    // Create a new end column
    const newEndCol = {
      id: end!.id,
      list: newEndList,
    }

    // Update the state
    setColumns((state) => ({
      ...state,
      [newStartCol.id]: newStartCol,
      [newEndCol.id]: newEndCol,
    }))
    return null
  }

  // console.log("logging")
  // console.log(pbis)
  // console.log("logged ja")
  // https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-search/#api-rest-api-3-issue-picker-get

  return (
    <div className="container">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="left-panel">
          <Column col={initialColumns.get("todo")!} />
        </div>
        <div className="resize-handle" />
        <div className="right-panel">
          <Column col={initialColumns.get("doing")!} />
          <Column col={initialColumns.get("done")!} />
        </div>
      </DragDropContext>
    </div>
  )
}
