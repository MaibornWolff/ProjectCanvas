import { Box, Stack, Title } from "@mantine/core"
import { useState } from "react"
import { DragDropContext } from "react-beautiful-dnd"
import { useParams } from "react-router-dom"
import { CaseColumns } from "./Case/CaseColumns"
import { Zoom } from "./Components/Zoom"
import { onDragEnd } from "./helpers/draggingHelpers"
import { AddLevel } from "./Level/AddLevel"
import { LevelAccordion } from "./Level/LevelAccordion"
import { useStoryMapStore } from "./StoryMapStore"

export function StoryMapView() {
  const { storyMapId } = useParams()
  const storyMaps = useStoryMapStore((state) => state.storyMaps)
  const storyMap = storyMaps?.find((_storyMap) => _storyMap.id === storyMapId)
  const [zoomValue, setZoomValue] = useState(1)

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
            <CaseColumns cases={storyMap.cases} levels={storyMap.levels} />
            <LevelAccordion
              storyMapId={storyMapId}
              cases={storyMap.cases}
              levels={storyMap.levels}
            />
            <AddLevel storyMapId={storyMapId} />
          </Box>
          <Zoom zoomValue={zoomValue} setZoomValue={setZoomValue} />
        </Stack>
      )}
    </DragDropContext>
  )
}
