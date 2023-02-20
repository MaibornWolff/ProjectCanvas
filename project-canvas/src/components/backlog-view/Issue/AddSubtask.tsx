/* eslint-disable @typescript-eslint/no-unused-vars */
import { Grid, TextInput, Button, ThemeIcon } from "@mantine/core"
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
      // console.log(createdSubtask);
      queryClient.invalidateQueries({ queryKey: ["issues"] })
    },
  })

  return (
    <Grid columns={100}>
      <Grid.Col span={92} pr="0px">
        <TextInput
          placeholder="Add Subtask"
          onChange={(e) => setSummary(e.target.value)}
        />
      </Grid.Col>
      <Grid.Col span={3}>
        <ThemeIcon size="lg" pl="0px" pr="0px">
          <Button
            sx={{
              backgroundColor: "transparent",
              ":hover": { backgroundColor: "transparent" },
            }}
            onClick={() => {
              mutationSubtask.mutate()
              setSummary("")
            }}
            type="submit"
          >
            <IconPlus />
          </Button>
        </ThemeIcon>
      </Grid.Col>
    </Grid>
  )
}
