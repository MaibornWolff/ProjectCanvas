import { useEffect, useState } from "react"
import { DndList, Pbi } from "./DndList"
// import { data } from "./pbiData"
import "./BacklogView.css"

export function BacklogView() {
  useEffect(() => {
    // @ts-ignore
    const leftPanel: HTMLElement = document.querySelector(".left-panel")
    // @ts-ignore
    const rightPanel: HTMLElement = document.querySelector(".right-panel")
    // @ts-ignore
    const resizeHandle: HTMLElement = document.querySelector(".resize-handle")

    let isDragging = false
    let currentX: number
    let initialLeftWidth: number
    let initialRightWidth: number

    resizeHandle.addEventListener("mousedown", (event) => {
      isDragging = true
      currentX = event.clientX
      initialLeftWidth = leftPanel.offsetWidth
      initialRightWidth = rightPanel.offsetWidth
    })

    document.addEventListener("mousemove", (event) => {
      if (!isDragging) {
        return
      }

      const deltaX = event.clientX - currentX
      const newLeftWidth = initialLeftWidth + deltaX
      const newRightWidth = initialRightWidth - deltaX

      leftPanel.style.width = `${newLeftWidth}px`
      rightPanel.style.width = `${newRightWidth}px`
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

  // console.log("logging")
  // console.log(pbis)
  // console.log("logged ja")
  // https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-search/#api-rest-api-3-issue-picker-get

  return (
    <div className="container">
      <div className="left-panel">
        <DndList data={pbis} />
      </div>
      <div className="resize-handle" />
      <div className="right-panel">Right Panel</div>
    </div>
  )
}
