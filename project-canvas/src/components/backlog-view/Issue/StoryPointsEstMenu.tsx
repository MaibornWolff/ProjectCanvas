import { useState, useRef } from "react"
import { Text, Group, NumberInput, Chip, Loader, Box } from "@mantine/core"
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
  const [showEditableInput, setShowEditableInput] = useState(false)
  const [showLoader, setShowLoader] = useState(false)

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
    const currentValue = val

    timeoutRef.current = window.setTimeout(() => {
      setShowEditableInput(false)
      setShowLoader(false)
      mutation.mutate({ storyPointsEstimate: currentValue } as Issue)
    }, 2000)
  }

  return (
    <Group position="apart">
      <Text color="dimmed">Story Points Estimate</Text>
      {!showEditableInput && storyPointsEstimate !== undefined && (
        <Group position="right">
          {showLoader && <Loader size="sm" />}
          <Chip
            p="10"
            variant="outline"
            onClick={() => setShowEditableInput(true)}
          >
            {storyPointsEstimate}
          </Chip>
        </Group>
      )}
      {showEditableInput &&
        storyPointsEstimate !== undefined &&
        editableFields &&
        editableFields.includes("Story point estimate") && (
          <Group position="right">
            {showLoader && <Loader size="sm" />}
            <Box w={70}>
              <NumberInput
                min={0}
                defaultValue={storyPointsEstimate}
                onChange={(val) => {
                  handleStoryPointsEstimateChange(val)
                  setShowLoader(true)
                }}
                onBlur={() => setShowEditableInput(false)}
              />
            </Box>
          </Group>
        )}
      {storyPointsEstimate === undefined &&
        editableFields &&
        !editableFields.includes("Story point estimate") && (
          <NumberInput width={100} min={0} defaultValue={0} disabled />
        )}
      {showEditableInput &&
        storyPointsEstimate === undefined &&
        editableFields &&
        editableFields.includes("Story point estimate") && (
          <Group position="right">
            {showLoader && <Loader size="sm" />}
            <Box w={70}>
              <NumberInput
                min={0}
                defaultValue={0}
                onChange={(val) => {
                  handleStoryPointsEstimateChange(val)
                  setShowLoader(true)
                }}
                onBlur={() => setShowEditableInput(false)}
              />
            </Box>
          </Group>
        )}
    </Group>
  )
}
