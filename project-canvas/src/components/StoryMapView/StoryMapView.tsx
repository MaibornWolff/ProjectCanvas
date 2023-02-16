import { Accordion, Group } from "@mantine/core"
import { DragDropContext } from "react-beautiful-dnd"
import { useImmer } from "use-immer"
import { Action, Case, CaseColumn } from "./CaseColumn"
import { CaseSubActions } from "./CaseSubActions"
import { onDragEnd } from "./helpers/draggingHelpers"

export function StoryMapView() {
  const [cases, setCases] = useImmer<Case[]>([
    {
      id: "a1",
      title: "a1",
      actions: [
        {
          id: "s1",
          action: "action1",
          subActions: ["sub-action1", "sub-action2"],
        },
        {
          id: "s2",
          action: "action2",
          subActions: ["sub-action11", "sub-action22"],
        },
      ],
    },
    {
      id: "a2",
      title: "a2",
      actions: [
        {
          id: "s3",
          action: "action3",
          subActions: ["sub-action3", "sub-action23"],
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
        .find((a) => a.id === id)
      if (caseAction) caseAction.subActions = subActions
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
          <CaseColumn key={caseColumn.title} {...caseColumn} />
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
