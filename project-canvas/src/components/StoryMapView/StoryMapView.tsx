import { Accordion, Box, Group } from "@mantine/core"
import { useState } from "react"
import { DragDropContext } from "react-beautiful-dnd"
import { useImmer } from "use-immer"
import { AddLevel } from "./Level/AddLevel"
import { AddCase } from "./Cards/Add/AddCase"
import { CaseColumn } from "./Case/CaseColumn"
import { CaseSubActionLevel } from "./Level/CaseSubActionLevel"
import { DeleteDropzone } from "./Components/DeleteDropzone"
import { onDragEnd } from "./helpers/draggingHelpers"
import {
  getAllActions,
  getAllSubActionGroups,
  getAllSubActions,
  getFilteredCasesForLevel,
  getRndInteger,
} from "./helpers/utils"
import { LevelControl } from "./Level/LevelControl"
import {
  Action,
  Case,
  SubAction,
  SubActionGroup,
  SubActionLevel,
} from "./Types"
import { Zoom } from "./Components/Zoom"

export function StoryMapView() {
  const [zoomValue, setZoomValue] = useState(1)
  const [levels, setLevels] = useImmer<SubActionLevel[]>([
    { id: "level-1", title: "level-1" },
    { id: "level-2", title: "level-2" },
  ])
  const [cases, setCases] = useImmer<Case[]>([
    {
      id: "a1",
      title: "a1",
      actions: [
        {
          id: "s1",
          title: "action1",
          subActionGroups: [
            {
              id: "sg-1",
              levelId: "level-1",
              subActions: [
                { id: "ss-1", title: "sub-action11" },
                { id: "ss-2", title: "sub-action12" },
              ],
            },
            {
              id: "sg-2",
              levelId: "level-2",
              subActions: [],
            },
          ],
        },
        {
          id: "s2",
          title: "action2",
          subActionGroups: [
            {
              id: "sg-3",
              levelId: "level-1",
              subActions: [
                { id: "ss-3", title: "sub-action21" },
                { id: "ss-4", title: "sub-action22" },
              ],
            },
            {
              id: "sg-4",
              levelId: "level-2",
              subActions: [],
            },
          ],
        },
      ],
    },
    {
      id: "a2",
      title: "a2",
      actions: [
        {
          id: "s3",
          title: "action3",
          subActionGroups: [
            {
              id: "sg-5",
              levelId: "level-1",
              subActions: [],
            },
            {
              id: "sg-6",
              levelId: "level-2",
              subActions: [{ id: "ss-6", title: "sub-action31" }],
            },
          ],
        },
      ],
    },
  ])

  const addCase = (caseColumn: Case) => {
    setCases((draft) => {
      draft.push(caseColumn)
    })
  }
  const deleteCase = (caseId: string) => {
    setCases((draft) => {
      const caseColumnIndex = draft.findIndex((c) => c.id === caseId)
      draft.splice(caseColumnIndex, 1)
    })
  }
  const updateCase = ({ id, actions, title }: Partial<Case>) => {
    setCases((draft) => {
      const caseColumn = draft.find((c) => c.id === id)
      if (caseColumn && actions) caseColumn.actions = actions
      if (caseColumn && title) caseColumn.title = title
    })
  }

  const addAction = (caseId: string, action: Action) => {
    setCases((draft) => {
      draft.find((c) => c.id === caseId)?.actions.push(action)
    })
  }
  const updateAction = ({ id, title, subActionGroups }: Partial<Action>) => {
    setCases((draft) => {
      const caseAction = getAllActions(draft).find(
        (_action) => _action.id === id
      )
      if (caseAction && title) caseAction.title = title
      if (caseAction && subActionGroups)
        caseAction.subActionGroups = subActionGroups
    })
  }

  const addSubAction = (subActionGroupId: string, subAction: SubAction) => {
    setCases((draft) => {
      const subActionGroup = getAllSubActionGroups(draft).find(
        (_subActionGroup) => _subActionGroup.id === subActionGroupId
      )
      if (subActionGroup) subActionGroup.subActions.push(subAction)
    })
  }
  const updateSubAction = ({ id, title }: Partial<SubAction>) => {
    setCases((draft) => {
      const subAction = getAllSubActions(draft).find(
        (_subAction) => _subAction.id === id
      )
      if (subAction && title) subAction.title = title
    })
  }

  const updateSubActionGroup = ({
    id,
    levelId,
    subActions,
  }: Partial<SubActionGroup>) => {
    setCases((draft) => {
      const subActionGroup = getAllSubActionGroups(draft).find(
        (_subActionGroup) => _subActionGroup.id === id
      )
      if (subActionGroup && levelId) subActionGroup.levelId = levelId
      if (subActionGroup && subActions) subActionGroup.subActions = subActions
    })
  }

  return (
    <DragDropContext
      onDragEnd={(dropResult) => {
        onDragEnd(dropResult, cases, updateCase, updateSubActionGroup)
      }}
    >
      <DeleteDropzone />
      <Zoom zoomValue={zoomValue} setZoomValue={setZoomValue} />
      <Box sx={{ zoom: zoomValue }}>
        <Group align="start" noWrap>
          {cases.map((caseColumn) => (
            <CaseColumn
              key={caseColumn.title}
              caseColumn={caseColumn}
              levels={levels}
              updateCase={updateCase}
              deleteCase={deleteCase}
              addAction={addAction}
              updateAction={updateAction}
            />
          ))}
          <AddCase
            onClick={() =>
              addCase({
                id: `a-${getRndInteger()}`,
                title: "New Case",
                actions: [],
              })
            }
          />
        </Group>
        <Accordion
          chevronPosition="left"
          styles={{ content: { padding: 0 } }}
          defaultValue={levels.map((level) => level.id)}
          multiple
        >
          {levels.map((level) => (
            <Accordion.Item key={level.id} value={level.id}>
              <LevelControl level={level} setLevels={setLevels} />
              <Accordion.Panel>
                <Group align="start">
                  <CaseSubActionLevel
                    filteredCases={getFilteredCasesForLevel(cases, level)}
                    levelId={level.id}
                    addSubAction={addSubAction}
                    updateSubAction={updateSubAction}
                  />
                </Group>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
        <AddLevel setCases={setCases} setLevels={setLevels} />
      </Box>
    </DragDropContext>
  )
}
