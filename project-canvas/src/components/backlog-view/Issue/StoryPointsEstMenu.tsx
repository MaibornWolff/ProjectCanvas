import { useRef } from "react"
import { Text, Group, NumberInput } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Issue } from "project-extender"
import {
  editIssue,
  getEditableIssueFields,
} from "../../CreateIssue/queryFunctions"

export function StoryPointsEstMenu({
  issueKey,
  storyPointsEstimate,
}: {
  issueKey: string
  storyPointsEstimate: number
}) {
  const queryClient = useQueryClient()
  const timeoutRef = useRef<number | null>(null)

  const { data: editableFields } = useQuery({
    queryKey: ["reporter", issueKey],
    queryFn: () => getEditableIssueFields(issueKey),
    enabled: !!issueKey,
  })

  const mutation = useMutation({
    mutationFn: (issue: Issue) => editIssue(issue, issueKey),
    onError: () => {
      showNotification({
        message: `The issue couldn't be modified! 😢`,
        color: "red",
      })
    },
    onSuccess: () => {
      showNotification({
        message: `The story point estimate for issue ${issueKey} has been modified!`,
        color: "green",
      })
      queryClient.invalidateQueries({ queryKey: ["issues"] })
    },
  })

  function handleStoryPointsEstimateChange(val: number | undefined) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      mutation.mutate({ storyPointsEstimate: val } as Issue)
    }, 2000)
  }

  return (
    <Group position="apart" grow>
      <Text color="dimmed">Story Points Estimate</Text>
      {storyPointsEstimate !== undefined &&
        editableFields &&
        editableFields.includes("Story point estimate") && (
          <NumberInput
            min={0}
            defaultValue={storyPointsEstimate}
            onChange={(val) => {
              handleStoryPointsEstimateChange(val)
            }}
          />
        )}
      {storyPointsEstimate === undefined &&
        editableFields &&
        !editableFields.includes("Story point estimate") && (
          <NumberInput min={0} defaultValue={0} disabled />
        )}
      {storyPointsEstimate === undefined &&
        editableFields &&
        editableFields.includes("Story point estimate") && (
          <NumberInput min={0} defaultValue={0} />
        )}
    </Group>
  )
}
