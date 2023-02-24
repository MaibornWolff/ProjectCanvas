/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  TextInput,
  Group,
  ActionIcon,
  Button,
  Box,
  Loader,
} from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { IconPlus } from "@tabler/icons"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { createSubtask } from "../../CreateIssue/queryFunctions"

export function AddSubtask(props: { issueKey: string; projectId: string }) {
  const queryClient = useQueryClient()

  const [summary, setSummary] = useState("")

  const mutationSubtask = useMutation({
    mutationFn: () => createSubtask(props.issueKey, summary, props.projectId),
    onSuccess(createdSubtask: { id: string; key: string }) {
      setSummary("")
      showNotification({
        message: `The issue  ${createdSubtask.key} has been created!`,
        color: "green",
      })
      queryClient.invalidateQueries({ queryKey: ["issues"] })
    },
  })

  return (
    <Group>
      <TextInput
        rightSection={
          <Box>
            <Button fullWidth>
              <IconPlus
                onClick={() => {
                  if (summary === "")
                    showNotification({
                      message: `The summary of an issue cannot be empty!`,
                      color: "red",
                    })
                  else mutationSubtask.mutate()
                }}
              />
            </Button>
          </Box>
        }
        mr="sm"
        placeholder="Add Subtask"
        sx={{ flex: 10 }}
        onChange={(e) => setSummary(e.target.value)}
        value={summary}
      />
      {mutationSubtask.isLoading && <Loader size="sm" />}
    </Group>
  )
}
