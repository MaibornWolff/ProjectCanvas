import { MultiSelect, Text, Group, Badge, Box } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import {
  Dispatch,
  FocusEventHandler,
  MouseEventHandler,
  SetStateAction,
} from "react"
import { getLabels } from "../../CreateIssue/queryFunctions"

export function Labels(props: {
  showLabelsInput: boolean
  handleBlur: FocusEventHandler<HTMLInputElement> | undefined
  handleDoubleClick: MouseEventHandler<HTMLInputElement> | undefined
  setLabels: Dispatch<SetStateAction<string[]>>
  labels: string[]
}) {
  const { data: allLabels } = useQuery({
    queryKey: ["labels"],
    queryFn: () => getLabels(),
  })
  return (
    <span>
      {props.showLabelsInput ? (
        <MultiSelect
          placeholder="Choose labels"
          nothingFound="No Options"
          searchable
          clearable
          data={allLabels!}
          onBlur={props.handleBlur}
          onChange={props.setLabels}
        />
      ) : (
        <Box onClick={props.handleDoubleClick}>
          {props.labels.length !== 0 ? (
            <Group onDoubleClick={props.handleDoubleClick}>
              {props.labels.map((label) => (
                <Badge>{label}</Badge>
              ))}
            </Group>
          ) : (
            <Text color="dimmed">None</Text>
          )}
        </Box>
      )}
    </span>
  )
}
