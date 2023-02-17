/* eslint-disable @typescript-eslint/no-unused-vars */
import { Accordion, Group } from "@mantine/core"
import { DragDropContext } from "react-beautiful-dnd"
import { useImmer } from "use-immer"
import { CaseColumn } from "./CaseColumn"
import { CaseSubActions } from "./CaseSubActions"
import { onDragEnd } from "./helpers/draggingHelpers"
import { Case, Action, SubAction } from "./types"

export function StoryMapView() {
  const [cases, setCases] = useImmer<Case[]>([
    {
      id: "a1",
      title: "a1",
      actions: [
        {
          id: "s1",
          title: "action1",
          subActions: [
            { id: "ss-1", title: "sub-action11" },
            { id: "ss-2", title: "sub-action12" },
          ],
        },
        {
          id: "s2",
          title: "action2",
          subActions: [
            { id: "ss-3", title: "sub-action21" },
            { id: "ss-4", title: "sub-action22" },
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
          subActions: [{ id: "ss-5", title: "sub-action3" }],
        },
      ],
    },
  ])
  const updateCase = (caseId: string, actions: Action[]) => {
    setCases((draft) => {
      const caseColumn = draft.find((c) => c.title === caseId)
      if (caseColumn) caseColumn.actions = actions
    })
  }
  const updateCaseAction = ({ id, subActions }: Action) => {
    setCases((draft) => {
      const caseAction = draft
        .map((_caseColumn) => _caseColumn.actions)
        .flat()
        .find((_action) => _action.id === id)
      if (caseAction) caseAction.subActions = subActions
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
      const caseColumn = draft.find((c) => c.id === caseId)
      if (caseColumn) caseColumn.actions.push(action)
    })
  }
  const editAction = ({ id, title }: Action) => {
    setCases((draft) => {
      const caseAction = draft
        .map((_caseColumn) => _caseColumn.actions)
        .flat()
        .find((_action) => _action.id === id)
      if (caseAction) caseAction.title = title
    })
  }

  const addSubAction = (actionId: string, subAction: SubAction) => {
    setCases((draft) => {
      const caseAction = draft
        .map((_caseColumn) => _caseColumn.actions)
        .flat()
        .find((_action) => _action.id === actionId)
      if (caseAction) caseAction.subActions.push(subAction)
    })
  }
  const editSubAction = ({ id, title }: SubAction) => {
    setCases((draft) => {
      const subAction = draft
        .map((_caseColumn) => _caseColumn.actions)
        .flat()
        .map((_action) => _action.subActions)
        .flat()
        .find((_subAction) => _subAction.id === id)
      if (subAction) subAction.title = title
    })
  }
  return (
    <DragDropContext
      onDragEnd={(dropResult) =>
        onDragEnd(dropResult, cases, updateCase, updateCaseAction)
      }
    >
      <Group align="start">
        {cases.map((caseColumn) => (
          <CaseColumn
            key={caseColumn.title}
            addAction={addAction}
            editAction={editAction}
            {...caseColumn}
          />
        ))}
      </Group>
      <Accordion chevronPosition="left" styles={{ content: { padding: 0 } }}>
        <Accordion.Item value="First">
          <Accordion.Control>First</Accordion.Control>
          <Accordion.Panel>
            <Group align="start">
              {cases.map((caseColumn) => (
                <CaseSubActions
                  key={caseColumn.title}
                  actions={caseColumn.actions}
                  addSubAction={addSubAction}
                  editSubAction={editSubAction}
                />
              ))}
            </Group>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </DragDropContext>
  )
}
