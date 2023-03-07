import { Box, Stack, Title } from "@mantine/core"
import { useState } from "react"
import { DragDropContext } from "react-beautiful-dnd"
import { useParams } from "react-router-dom"
import { useImmer } from "use-immer"
import { CaseColumns } from "./Case/CaseColumns"
import { Zoom } from "./Components/Zoom"
import { defaultStoryMap } from "./helpers/defaultStoryMap"
import { onDragEnd } from "./helpers/draggingHelpers"
import { AddLevel } from "./Level/AddLevel"
import { LevelAccordion } from "./Level/LevelAccordion"
import { useStoryMapStore } from "./StoryMapStore"
import { Case, SubActionLevel } from "./Types"

export function StoryMapView() {
  const { storyMapId } = useParams()
  const storyMaps = useStoryMapStore((state) => state.storyMaps)
  const storyMap = storyMaps?.find((_storyMap) => _storyMap.id === storyMapId)
  const [zoomValue, setZoomValue] = useState(1)

  const [levels, setLevels] = useImmer<SubActionLevel[]>([
    { id: "level-1", title: "level-1" },
    { id: "level-2", title: "level-2" },
  ])
  const [, setCases] = useImmer<Case[]>(defaultStoryMap)

  const updateCase = useStoryMapStore((state) => state.updateCase)
  const updateSubActionGroup = useStoryMapStore(
    (state) => state.updateSubActionGroup
  )
  return (
    <DragDropContext
      onDragEnd={(dropResult) => {
        onDragEnd(dropResult, storyMap!.cases, updateCase, updateSubActionGroup)
      }}
    >
      {storyMapId && storyMap && (
        <Stack spacing="xl">
          <Title>{storyMap.name}</Title>
          <Box sx={{ zoom: zoomValue }}>
            <CaseColumns cases={storyMap.cases} levels={levels} />
            <LevelAccordion
              cases={storyMap.cases}
              setCases={setCases}
              levels={levels}
              setLevels={setLevels}
            />
            <AddLevel setCases={setCases} setLevels={setLevels} />
          </Box>
          <Zoom zoomValue={zoomValue} setZoomValue={setZoomValue} />
        </Stack>
      )}
    </DragDropContext>
  )
}
