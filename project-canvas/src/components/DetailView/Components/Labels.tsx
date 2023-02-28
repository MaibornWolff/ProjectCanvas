import { MultiSelect, Text, Group, Badge, Box } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Issue } from "project-extender"
import { useState } from "react"
import { getLabels } from "../../CreateIssue/queryFunctions"
import { editIssue } from "../helpers/queryFunctions"

export function Labels({
  labels,
  issueKey,
}: {
  labels: string[]
  issueKey: string
}) {
  const [defaultLabels, setdefaultLabels] = useState(labels)
  const [showLabelsInput, setshowLabelsInput] = useState(false)
  const { data: allLabels } = useQuery({
    queryKey: ["labels"],
    queryFn: () => getLabels(),
  })
  const mutationLalbels = useMutation({
    mutationFn: (issue: Issue) => editIssue(issue, issueKey),
    onError: () => {
      showNotification({
        message: `An error occured while modifing the Labels 😢`,
        color: "red",
      })
    },
    onSuccess: () => {
      showNotification({
        message: `Labels for issue ${issueKey} has been modified!`,
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
          defaultValue={defaultLabels}
          data={allLabels!}
          onBlur={() => {
            setshowLabelsInput(false)
            mutationLalbels.mutate({
              labels: defaultLabels,
            } as Issue)
          }}
          onChange={(value) => setdefaultLabels(value)}
        />
      ) : (
        <Box onClick={() => setshowLabelsInput(true)}>
          {defaultLabels.length !== 0 ? (
            <Group>
              {defaultLabels.map((label) => (
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
