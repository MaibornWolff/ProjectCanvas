import { Accordion, Group } from "@mantine/core"
import { DragDropContext } from "react-beautiful-dnd"
import { useImmer } from "use-immer"
import { Action, Case, CaseColumn } from "./CaseColumn"
import { CaseSubActions } from "./CaseSubActions"
import { onDragEnd } from "./helpers/draggingHelpers"

export function StoryMapView() {
  const [cases, setCases] = useImmer<Case[]>([
    {
      title: "a1",
      actions: [
        {
          id: "s1",
          action: "action1",
          subActions: { id: "s1", items: ["sub-action1", "sub-action2"] },
        },
        {
          id: "s2",
          action: "action2",
          subActions: { id: "s2", items: ["ction-1-2", "ction-2-2"] },
        },
      ],
    },
    {
      title: "a2",
      actions: [
        {
          id: "s3",
          action: "action3",
          subActions: { id: "s3", items: ["sub-action3", "sub-action23"] },
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
  const updateCaseAction = (action: Action) => {
    setCases((draft) => {
      draft.forEach((_caseColumn) => {
        const newAction = _caseColumn.actions.find((a) => a.id === action.id)
        if (newAction)
          newAction.subActions = {
            ...newAction.subActions,
            ...action.subActions,
          }
      })
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
            title={caseColumn.title}
            actions={caseColumn.actions}
          />
        ))}
      </Group>
      <Accordion
        variant="contained"
        chevronPosition="left"
        defaultValue="customization"
        styles={{ content: { padding: 0 } }}
      >
        <Accordion.Item value="First">
          <Accordion.Control>First</Accordion.Control>
          <Accordion.Panel>
            <Group align="start">
              {cases.map((caseColumn) => (
                <CaseSubActions
                  key={caseColumn.title}
                  actions={caseColumn.actions}
                />
              ))}
            </Group>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </DragDropContext>
  )
}
