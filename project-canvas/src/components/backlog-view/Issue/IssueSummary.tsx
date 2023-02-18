import { TextInput, Title } from "@mantine/core"
import { Issue } from "project-extender"
import { useState } from "react"
import { showNotification } from "@mantine/notifications"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { editIssue } from "../../CreateIssue/queryFunctions"

export function IssueSummary(props: { summary: string; issueKey: string }) {
  const [defaultsummary, setdefaultsummary] = useState(props.summary)
  const [showSummaryInput, setshowSummaryInput] = useState(false)
  const queryClient = useQueryClient()

  const mutationSummary = useMutation({
    mutationFn: (issue: Issue) => editIssue(issue, props.issueKey),
    onError: () => {
      showNotification({
        message: `error occured while modifing the summary 😢`,
        color: "red",
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] })
      showNotification({
        message: `Summary of issue ${props.issueKey} has been modified!`,
        color: "green",
      })
    },
  })
  return (
    <span>
      {showSummaryInput ? (
        <TextInput
          value={defaultsummary}
          onChange={(e) => setdefaultsummary(e.target.value)}
          onBlur={() => {
            if (defaultsummary === "")
              showNotification({
                message: `Summary of an issue cannot be empty`,
                color: "red",
              })
            else {
              setshowSummaryInput(false)
              mutationSummary.mutate({
                summary: defaultsummary,
              } as Issue)
            }
          }}
          variant="unstyled"
          size="xl"
          mb={30}
          required
        />
      ) : (
        <Title order={2} mb={30} onClick={() => setshowSummaryInput(true)}>
          {defaultsummary}
        </Title>
      )}
    </span>
  )
}
