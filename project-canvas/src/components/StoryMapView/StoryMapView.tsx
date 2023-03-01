import { Box } from "@mantine/core"
import { useState } from "react"
import { DragDropContext } from "react-beautiful-dnd"
import { useImmer } from "use-immer"
import { CaseColumns } from "./Case/CaseColumns"
import { DeleteDropzone } from "./Components/DeleteDropzone"
import { Zoom } from "./Components/Zoom"
import { defaultStoryMap } from "./helpers/defaultStoryMap"
import { onDragEnd } from "./helpers/draggingHelpers"
import {
  updateCaseFn,
  updateSubActionGroupFn,
} from "./helpers/updaterFunctions"
import { AddLevel } from "./Level/AddLevel"
import { LevelAccordion } from "./Level/LevelAccordion"
import { Case, SubActionLevel } from "./Types"

export function StoryMapView() {
  const [zoomValue, setZoomValue] = useState(1)

  const [levels, setLevels] = useImmer<SubActionLevel[]>([
    { id: "level-1", title: "level-1" },
    { id: "level-2", title: "level-2" },
  ])
  const [cases, setCases] = useImmer<Case[]>(defaultStoryMap)

  const updateCase = updateCaseFn(setCases)
  const updateSubActionGroup = updateSubActionGroupFn(setCases)

  return (
    <DragDropContext
      onDragEnd={(dropResult) => {
        onDragEnd(dropResult, cases, updateCase, updateSubActionGroup)
      }}
    >
      <DeleteDropzone />
      <Zoom zoomValue={zoomValue} setZoomValue={setZoomValue} />
      <Box sx={{ zoom: zoomValue }}>
        <CaseColumns cases={cases} setCases={setCases} levels={levels} />
        <LevelAccordion
          cases={cases}
          setCases={setCases}
          levels={levels}
          setLevels={setLevels}
        />
        <AddLevel setCases={setCases} setLevels={setLevels} />
      </Box>
    </DragDropContext>
  )
}
