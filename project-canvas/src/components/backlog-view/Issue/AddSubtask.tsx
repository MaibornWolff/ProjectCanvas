/* eslint-disable @typescript-eslint/no-unused-vars */
import { TextInput, Group, ActionIcon, Button } from "@mantine/core"
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
      queryClient.invalidateQueries({ queryKey: ["issues"] })
    },
  })

  return (
    <Group>
      <TextInput
        placeholder="Add Subtask"
        sx={{ flex: 8 }}
        onChange={(e) => setSummary(e.target.value)}
      />
      <Button
        p={0}
        sx={{ flex: 1 }}
        onClick={() => {
          mutationSubtask.mutate()
          setSummary("")
        }}
      >
        <IconPlus />
      </Button>
    </Group>
  )
}
