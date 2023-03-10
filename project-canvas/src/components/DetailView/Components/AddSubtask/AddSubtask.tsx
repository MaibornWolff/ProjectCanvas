/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Button, Group, Loader, TextInput } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { IconPlus } from "@tabler/icons"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { createSubtaskMutation } from "./queries"

export function AddSubtask({
  issueKey,
  projectId,
}: {
  issueKey: string
  projectId: string
}) {
  const queryClient = useQueryClient()

  const [summary, setSummary] = useState("")

  const createSubstask = createSubtaskMutation(
    issueKey,
    summary,
    projectId,
    queryClient,
    () => setSummary("")
  )

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
                  else createSubstask.mutate()
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
      {createSubstask.isLoading && <Loader size="sm" />}
    </Group>
  )
}
