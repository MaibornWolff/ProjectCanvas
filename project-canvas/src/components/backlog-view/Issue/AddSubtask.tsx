/* eslint-disable @typescript-eslint/no-unused-vars */
import { TextInput, Group, ActionIcon, Button, Box } from "@mantine/core"
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
      showNotification({
        message: `issue  ${createdSubtask.key} has been created!`,
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
                  mutationSubtask.mutate()
                  setSummary("")
                }}
              />
            </Button>
          </Box>
        }
        mr="sm"
        placeholder="Add Subtask"
        sx={{ flex: 10 }}
        onChange={(e) => setSummary(e.target.value)}
      />
    </Group>
  )
}
