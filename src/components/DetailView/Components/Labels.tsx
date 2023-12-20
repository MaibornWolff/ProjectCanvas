import {
  MultiSelect,
  Text,
  Group,
  Badge,
  Box,
  useMantineTheme,
} from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Issue } from "types"
import { useState } from "react"
import { getLabels } from "../../CreateIssue/queryFunctions"
import { editIssue } from "../helpers/queryFunctions"

export function Labels({
  labels,
  issueKey,
  onMutate = () => {}
}: {
  labels: string[]
  issueKey: string
  onMutate?: () => void
}) {
  const theme = useMantineTheme()
  const [defaultLabels, setDefaultLabels] = useState(labels)
  const [showLabelsInput, setShowLabelsInput] = useState(false)
  const { data: allLabels } = useQuery({
    queryKey: ["labels"],
    queryFn: () => getLabels(),
  })
  const mutationLabels = useMutation({
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
      onMutate()
    },
  })
  return (
    <Box
      sx={{
        ":hover": {
          cursor: "pointer",
          boxShadow: theme.shadows.xs,
          borderRadius: theme.radius.xs,
          transition: "background-color .8s ease-out",
        },
      }}
    >
      {showLabelsInput ? (
        <MultiSelect
          placeholder="Choose labels"
          nothingFound="No Options"
          searchable
          clearable
          defaultValue={defaultLabels}
          data={allLabels || []}
          onBlur={() => {
            setShowLabelsInput(false)
            mutationLabels.mutate({
              labels: defaultLabels,
            } as Issue)
          }}
          onChange={(value) => setDefaultLabels(value)}
        />
      ) : (
        <Box onClick={() => setShowLabelsInput(true)}>
          {defaultLabels.length !== 0 ? (
            <Group gap={3}>
              {defaultLabels.map((label) => (
                <Badge key={label} color="yellow">
                  {label}
                </Badge>
              ))}
            </Group>
          ) : (
            <Text color="dimmed">None</Text>
          )}
        </Box>
      )}
    </Box>
  )
}
