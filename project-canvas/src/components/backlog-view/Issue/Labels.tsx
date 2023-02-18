import { MultiSelect, Text, Group, Badge, Box } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Issue } from "project-extender"
import { useState } from "react"
import { editIssue, getLabels } from "../../CreateIssue/queryFunctions"

export function Labels(props: { labels: string[]; issueKey: string }) {
  const queryClient = useQueryClient()
  const [defaultlabels, setdefaultlabels] = useState(props.labels)
  const [showLabelsInput, setshowLabelsInput] = useState(false)
  const { data: allLabels } = useQuery({
    queryKey: ["labels"],
    queryFn: () => getLabels(),
  })
  const mutationLalbels = useMutation({
    mutationFn: (issue: Issue) => editIssue(issue, props.issueKey),
    onError: () => {
      showNotification({
        message: `error occured while modifing the Labels 😢`,
        color: "red",
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] })
      showNotification({
        message: `Labels for issue ${props.issueKey} has been modified!`,
        color: "green",
      })
    },
  })
  return (
    <span>
      {showLabelsInput ? (
        <MultiSelect
          placeholder="Choose labels"
          nothingFound="No Options"
          searchable
          clearable
          defaultValue={props.labels}
          data={allLabels!}
          onBlur={() => {
            setshowLabelsInput(false)
            mutationLalbels.mutate({
              labels: defaultlabels,
            } as Issue)
          }}
          onChange={setdefaultlabels}
        />
      ) : (
        <Box onClick={() => setshowLabelsInput(true)}>
          {props.labels.length !== 0 ? (
            <Group>
              {props.labels.map((label) => (
                <Badge color="yellow">{label}</Badge>
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
