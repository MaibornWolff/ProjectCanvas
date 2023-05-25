import { useState, useRef, useEffect } from "react"
import {
  Text,
  Group,
  NumberInput,
  Chip,
  Loader,
  Box,
  useMantineTheme,
} from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Issue } from "types"
import { getEditableIssueFields } from "../../CreateIssue/queryFunctions"
import { editIssue } from "../helpers/queryFunctions"

export function StoryPointsEstimateMenu({
  issueKey,
  storyPointsEstimate,
}: {
  issueKey: string
  storyPointsEstimate: number
}) {
  const queryClient = useQueryClient()
  const theme = useMantineTheme()
  const timeoutRef = useRef<number | null>(null)
  const [localStoryPtsEstimate, setLocalStoryPtsEstimate] =
    useState(storyPointsEstimate)
  const [showEditableInput, setShowEditableInput] = useState(false)
  const [showLoader, setShowLoader] = useState(false)

  useEffect(() => {
    setShowLoader(false)
  }, [storyPointsEstimate])

  const { data: editableFields } = useQuery({
    queryKey: ["editableFields", issueKey],
    queryFn: () => getEditableIssueFields(issueKey),
    enabled: !!issueKey,
  })

  const mutation = useMutation({
    mutationFn: (issue: Issue) => editIssue(issue, issueKey),
    onError: () => {
      showNotification({
        message: `The story point estimate for issue ${issueKey} couldn't be modified! 😢`,
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
      mutation.mutate({ storyPointsEstimate: currentValue } as Issue)
    }, 2000)
  }

  return editableFields && editableFields.includes("Story point estimate") ? (
    <Group grow>
      <Text color="dimmed" fz="sm">
        Story Points Estimate
      </Text>
      {!showEditableInput &&
        storyPointsEstimate !== undefined &&
        editableFields &&
        editableFields.includes("Story point estimate") && (
          <Group>
            {localStoryPtsEstimate ? (
              <Chip onClick={() => setShowEditableInput(true)}>
                {localStoryPtsEstimate}
              </Chip>
            ) : (
              <Text
                color="dimmed"
                onClick={() => setShowEditableInput(true)}
                w="100%"
                sx={{
                  ":hover": {
                    cursor: "pointer",
                    boxShadow: theme.shadows.xs,
                    borderRadius: theme.radius.xs,
                    transition: "background-color .8s ease-out",
                  },
                }}
              >
                None
              </Text>
            )}
            {showLoader && <Loader size="sm" />}
          </Group>
        )}
      {showEditableInput &&
        storyPointsEstimate !== undefined &&
        editableFields &&
        editableFields.includes("Story point estimate") && (
          <Group>
            <Box w={60}>
              <NumberInput
                min={0}
                defaultValue={localStoryPtsEstimate}
                onChange={(val) => {
                  setLocalStoryPtsEstimate(val!)
                  handleStoryPointsEstimateChange(val)
                  setShowLoader(true)
                }}
                onBlur={() => setShowEditableInput(false)}
              />
            </Box>
            {showLoader && <Loader size="sm" />}
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
            <Box w={70}>
              <NumberInput
                min={0}
                defaultValue={0}
                onChange={(val) => {
                  setLocalStoryPtsEstimate(val!)
                  handleStoryPointsEstimateChange(val)
                  setShowLoader(true)
                }}
                onBlur={() => setShowEditableInput(false)}
              />
            </Box>
            {showLoader && <Loader size="sm" />}
          </Group>
        )}
    </Group>
  ) : null
}
