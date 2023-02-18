/* eslint-disable @typescript-eslint/no-unused-vars */
import { Accordion, Group, Title } from "@mantine/core"
import { DragDropContext } from "react-beautiful-dnd"
import { useImmer } from "use-immer"
import { AddLevel } from "./AddLevel"
import { CaseColumn } from "./CaseColumn"
import { CaseSubActionLevel } from "./CaseSubActionLevel"
import { onDragEnd } from "./helpers/draggingHelpers"
import {
  getAllActions,
  getAllSubActionGroups,
  getFilteredCasesForLevel,
  getAllSubActions,
  getRndInteger,
} from "./helpers/utils"
import { Action, Case, SubAction, SubActionLevel } from "./types"

export function StoryMapView() {
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
              subActions: [{ id: "ss-3", title: "sub-action21" }],
            },
          ],
        },
      ],
    },
  ])
  const updateCase = (caseId: string, actions: Action[]) => {
    setCases((draft) => {
      const caseColumn = draft.find((c) => c.id === caseId)
      if (caseColumn) caseColumn.actions = actions
    })
  }
  const editCase = ({ id, title }: Case) => {
    setCases((draft) => {
      const caseColumn = draft.find((c) => c.id === id)
      if (caseColumn) caseColumn.title = title
    })
  }

  const addAction = (caseId: string, action: Action) => {
    setCases((draft) => {
      draft.find((c) => c.id === caseId)?.actions.push(action)
    })
  }

  const editAction = ({ id, title }: Action) => {
    setCases((draft) => {
      const caseAction = getAllActions(draft).find(
        (_action) => _action.id === id
      )
      if (caseAction) caseAction.title = title
    })
  }
  const updateAction = ({ id, subActionGroups }: Action) => {
    setCases((draft) => {
      const caseAction = getAllActions(draft).find(
        (_action) => _action.id === id
      )
      if (caseAction) caseAction.subActionGroups = subActionGroups
    })
  }

  const addSubAction = (subActionGroupId: string, subAction: SubAction) => {
    setCases((draft) => {
      const caseAction = getAllSubActionGroups(draft).find(
        (_subActionGroup) => _subActionGroup.id === subActionGroupId
      )
      if (caseAction) caseAction.subActions.push(subAction)
    })
  }
  const editSubAction = ({ id, title }: SubAction) => {
    setCases((draft) => {
      const subAction = getAllSubActions(draft).find(
        (_subAction) => _subAction.id === id
      )
      if (subAction) subAction.title = title
    })
  }
  return (
    <DragDropContext onDragEnd={(dropResult) => {}}>
      <Group align="start">
        {cases.map((caseColumn) => (
          <CaseColumn
            key={caseColumn.title}
            levels={levels}
            addAction={addAction}
            editAction={editAction}
            {...caseColumn}
          />
        ))}
      </Group>
      <Accordion
        chevronPosition="left"
        styles={{ content: { padding: 0 } }}
        defaultValue={levels.map((level) => level.id)}
        multiple
      >
        {levels.map((level) => (
          <Accordion.Item key={level.id} value={level.id}>
            <Accordion.Control>{level.title}</Accordion.Control>
            <Accordion.Panel>
              <Group align="start">
                <CaseSubActionLevel
                  filteredCases={getFilteredCasesForLevel(cases, level)}
                  levelId={level.id}
                  addSubAction={addSubAction}
                  editSubAction={editSubAction}
                />
              </Group>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
      <AddLevel
        onClick={() => {
          const levelId = `level-${getRndInteger()}`
          setLevels((draft) => {
            draft.push({ id: levelId, title: "New Level" })
          })
          setCases((draft) => {
            getAllActions(draft)
              .map((action) => action.subActionGroups)
              .forEach((subActionGroup) =>
                subActionGroup.push({
                  id: `sg-${getRndInteger()}`,
                  levelId,
                  subActions: [],
                })
              )
          })
        }}
      />
    </DragDropContext>
  )
}
