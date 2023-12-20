/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Button, Group, Loader, TextInput } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { IconPlus } from "@tabler/icons"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { createSubtaskMutation } from "./queries"
import { getIssueTypes } from "./queryFunctions"

export function AddSubtask({
  issueKey,
  projectId,
}: {
  issueKey: string
  projectId: string
}) {
  const queryClient = useQueryClient()
  const [summary, setSummary] = useState("")
  const { data: issueTypes } = useQuery({
    queryKey: ["issueTypes", projectId],
    queryFn: () => getIssueTypes(projectId),
    enabled: !!projectId,
  })

  const issueTypeWithSubTask = issueTypes?.find(
    (issueType) => issueType?.subtask === true
  )

  const createSubstask = createSubtaskMutation(
    issueKey,
    summary,
    projectId,
    queryClient,
    `${issueTypeWithSubTask?.id.toString()}`,
    () => setSummary("")
  )

  return (
    <Group>
      <TextInput
        w="100%"
        mr="sm"
        placeholder="Add Subtask"
        style={{ flex: 10 }}
        onChange={(e) => setSummary(e.target.value)}
        value={summary}
      />
      <Box>
        <Button p="5px">
          <IconPlus
            onClick={() => {
              if (summary === "")
                showNotification({
                  message: `The summary of an issue cannot be empty!`,
                  color: "red",
                })
              else createSubstask.mutate()
            }}
          />
        </Button>
      </Box>
      {createSubstask.isLoading && <Loader size="sm" />}
    </Group>
  )
}
