import { Box, Stack, Title } from "@mantine/core";
import { useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { useParams } from "react-router-dom";
import { CaseColumns } from "./Case/CaseColumns";
import { Zoom } from "./Components/Zoom";
import { onDragEnd } from "./helpers/draggingHelpers";
import { AddLevel } from "./Level/AddLevel";
import { LevelAccordion } from "./Level/LevelAccordion";
import { useStoryMapStore } from "./StoryMapStore";
import { Case } from "./Types";

export function StoryMapView() {
  const { storyMapId } = useParams();
  const storyMaps = useStoryMapStore((state) => state.storyMaps);
  const storyMap = storyMaps?.find((_storyMap) => _storyMap.id === storyMapId);
  const [zoomValue, setZoomValue] = useState(1);

  const updateCase = useStoryMapStore((state) => state.updateCase);
  const updateCaseFn = (caseColumn: Partial<Case>) =>
    updateCase(storyMapId!, caseColumn);

  const updateSubActionGroup = useStoryMapStore(
    (state) => state.updateSubActionGroup
  );
  const updateSubActionGroupFn = (caseColumn: Partial<Case>) =>
    updateSubActionGroup(storyMapId!, caseColumn);

  return (
    <DragDropContext
      onDragEnd={(dropResult) => {
        onDragEnd(
          dropResult,
          storyMap!.cases,
          updateCaseFn,
          updateSubActionGroupFn
        );
      }}
    >
      {storyMapId && storyMap && (
        <Stack gap="xl">
          <Title>{storyMap.name}</Title>
          <Box style={{ zoom: zoomValue }}>
            <CaseColumns
              storyMapId={storyMapId}
              cases={storyMap.cases}
              levels={storyMap.levels}
            />
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
  );
}
